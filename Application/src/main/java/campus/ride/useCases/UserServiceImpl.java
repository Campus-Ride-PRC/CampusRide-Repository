package campus.ride.useCases;

import campus.ride.config.JwtUtil;
import campus.ride.contracts.faculty.FacultyRepository;
import campus.ride.contracts.friend.FriendRepository;
import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.Faculty;
import campus.ride.entities.Friend;
import campus.ride.entities.User;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.exception.UserAlreadyExistsException;
import campus.ride.interfaces.EmailService;
import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.FriendDto;
import campus.ride.transfer.dtos.user.FriendRequestDto;
import campus.ride.transfer.dtos.user.FriendRequestResponseDto;
import campus.ride.transfer.dtos.user.FriendRequestStatusDto;
import campus.ride.transfer.dtos.user.FriendshipStatusDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.VerificationRequestDto;
import campus.ride.transfer.mappings.FacultyMapper;
import campus.ride.transfer.mappings.UserMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);
    
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final Cache verificationCache;
    private final FacultyRepository facultyRepository;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                             FriendRepository friendRepository, PasswordEncoder passwordEncoder,
                             EmailService emailService,
                             CacheManager cacheManager,
                             FacultyRepository facultyRepository,
                             JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCache = cacheManager.getCache("verificationCache");
        this.facultyRepository = facultyRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<UserResponseDto> findByEmail(String email) {
        logger.debug("Finding user by email: {}", email);
        
        if (email == null || email.trim().isEmpty()) {
            logger.warn("Empty email provided to findByEmail");
            throw new BadRequestException("Email cannot be null or empty");
        }
        
        Optional<User> userOptional = userRepository.findByEmail(email.trim());
        
        if (userOptional.isEmpty()) {
            logger.debug("No user found in repository for email: {}", email);
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        
        logger.debug("User found in repository for email: {}", email);
        return CompletableFuture.completedFuture(UserMapper.toDto(userOptional.get()));
    }

    @Override
    @Async
    public CompletableFuture<String> registerUser(CreateUserRequestDto request) {
        logger.info("Registering user with email: {}", request.getEmail());
        String email = request.getEmail().trim();

        if (!email.endsWith("@stud.ubbcluj.ro") && !email.endsWith("@ubbcluj.ro")) {
            throw new BadRequestException("Email must be a @stud.ubbcluj.ro address");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + email + " already exists");
        }
        if (verificationCache.get(email) != null) {
            throw new BadRequestException("A verification email has already been sent.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        String verificationCode = generateVerificationCode();

        PendingUserData pendingData = new PendingUserData(
                hashedPassword,
                verificationCode,
                request.getPhoneNumber(),
                request.getFirstName(),
                request.getLastName(),
                FacultyMapper.toEntity(request.getFaculty())
        );
        verificationCache.put(email, pendingData);
        emailService.sendVerificationEmail(email, verificationCode, request.getFirstName(), request.getLastName());

        logger.info("Successfully sent verification code to: {}", email);
        return CompletableFuture.completedFuture("Registration successful. Please check your email (or console) to verify.");
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<UserResponseDto> verifyUser(VerificationRequestDto request) {
        String email = request.getEmail().trim();
        logger.info("Attempting to verify user with email: {}", email);

        PendingUserData pendingData = verificationCache.get(email, PendingUserData.class);

        if (pendingData == null) {
            throw new BadRequestException("Invalid or expired verification code.");
        }
        
        logger.info("Received code = {}, backend code = {}", request.getVerificationCode(), pendingData.getVerificationCode());
        if (!pendingData.getVerificationCode().equals(request.getVerificationCode())) {
            throw new BadRequestException("Invalid verification code.");
        }

        if (pendingData.getFaculty() == null || pendingData.getFaculty().getId() == null) {
            throw new IllegalStateException("Datele de înregistrare sunt corupte. Nu s-a găsit nicio facultate.");
        }
        Long facultyId = pendingData.getFaculty().getId();

        Faculty facultyReala = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty with ID " + facultyId + " was not found."));

        User user = new User();
        user.setEmail(email);
        user.setPassword(pendingData.getHashedPassword());
        user.setPhoneNumber(pendingData.getPhoneNumber());
        user.setFirstName(pendingData.getFirstName());
        user.setLastName(pendingData.getLastName());

        user.setFaculty(facultyReala);
        User savedUser = userRepository.save(user);
        verificationCache.evict(email);

        logger.info("Successfully verified and created user with ID: {}", savedUser.getId());
        return CompletableFuture.completedFuture(UserMapper.toDto(savedUser));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<UserResponseDto> login(String email, String password) {
        logger.info("Attempting login for email: {}", email);

        if (email == null || email.trim().isEmpty() || password == null || password.isEmpty()) {
            throw new BadRequestException("Email and password are required");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid login attempt for email: {}", email);
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        
        logger.info("Login successful for email: {}", email);
        UserResponseDto response = UserMapper.toDto(user);
        response.setToken(token);
        return CompletableFuture.completedFuture(response);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<UserResponseDto> getMe() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return findByEmail(email);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<UserResponseDto>> getAllUsers() {
        return CompletableFuture.completedFuture(userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(user.getId(), user.getEmail(), user.getAddress(), user.getPhoneNumber(), user.getFirstName(), user.getLastName(), FacultyMapper.toDto(user.getFaculty())))
                .collect(Collectors.toList()));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> sendFriendRequest(FriendRequestDto request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User receiver = userRepository.findById(Long.valueOf(request.getReceiverId()))
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException("You cannot send a friend request to yourself.");
        }

        friendRepository.findBySenderAndReceiver(sender, receiver).ifPresent(friend -> {
            throw new BadRequestException("Friend request already sent.");
        });

        Friend friend = new Friend();
        friend.setSender(sender);
        friend.setReceiver(receiver);
        friend.setStatus("PENDING");

        friendRepository.save(friend);
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Long> getFriendCount() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return CompletableFuture.completedFuture(friendRepository.countAcceptedFriends(user));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<FriendRequestResponseDto>> getPendingFriendRequests() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Friend> pendingRequests = friendRepository.findPendingRequestsByReceiver(user);

        List<FriendRequestResponseDto> dtos = pendingRequests.stream()
                .map(friend -> new FriendRequestResponseDto(
                        friend.getId(),
                        friend.getSender().getId(),
                        friend.getSender().getFirstName(),
                        friend.getSender().getLastName(),
                        friend.getSender().getEmail(),
                        friend.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(dtos);
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> acceptFriendRequest(Long requestId) {
        Friend friend = friendRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!friend.getReceiver().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to accept this request");
        }

        friend.setStatus("ACCEPTED");
        friendRepository.save(friend);
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> declineFriendRequest(Long requestId) {
        Friend friend = friendRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found"));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!friend.getReceiver().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to decline this request");
        }

        friend.setStatus("DECLINED");
        friendRepository.save(friend);
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<FriendRequestStatusDto>> getFriendRequestStatus() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Friend> requests = friendRepository.findCompletedRequestsBySender(user);

        List<FriendRequestStatusDto> dtos = requests.stream()
                .map(friend -> new FriendRequestStatusDto(
                        friend.getId(),
                        friend.getReceiver().getId(),
                        friend.getReceiver().getFirstName(),
                        friend.getReceiver().getLastName(),
                        friend.getStatus(),
                        friend.getUpdatedAt()
                ))
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(dtos);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<FriendDto>> getFriends() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Friend> friends = friendRepository.findAcceptedFriends(user);

        List<FriendDto> dtos = friends.stream()
                .map(friend -> {
                    User friendUser = friend.getSender().getId().equals(user.getId()) ? friend.getReceiver() : friend.getSender();
                    return new FriendDto(
                            friendUser.getId(),
                            friendUser.getFirstName(),
                            friendUser.getLastName(),
                            friendUser.getEmail(),
                            friendUser.getFaculty() != null ? friendUser.getFaculty().getName() : null
                    );
                })
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(dtos);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<FriendshipStatusDto> getFriendshipStatus(Long otherUserId) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Other user not found"));

        Optional<Friend> friendship = friendRepository.findFriendship(currentUser, otherUser);

        if (friendship.isEmpty()) {
            return CompletableFuture.completedFuture(new FriendshipStatusDto("NONE", false));
        }

        Friend friend = friendship.get();
        boolean isSender = friend.getSender().getId().equals(currentUser.getId());

        return CompletableFuture.completedFuture(new FriendshipStatusDto(friend.getStatus(), isSender));
    }

    private static class PendingUserData implements java.io.Serializable {
        private String hashedPassword;
        private String verificationCode;
        private String phoneNumber;
        private String firstName;
        private String lastName;
        private Faculty faculty;

        public PendingUserData(String hashedPassword, String verificationCode, String phoneNumber,
                                 String firstName, String lastName, Faculty faculty) {
            this.hashedPassword = hashedPassword;
            this.verificationCode = verificationCode;
            this.phoneNumber = phoneNumber;
            this.firstName = firstName;
            this.lastName = lastName;
            this.faculty = faculty;
        }

        public String getHashedPassword() { return hashedPassword; }
        public String getVerificationCode() { return verificationCode; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public Faculty getFaculty() { return faculty; }
    }

    private String generateVerificationCode() {
        java.util.Random random = new java.util.Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

}
