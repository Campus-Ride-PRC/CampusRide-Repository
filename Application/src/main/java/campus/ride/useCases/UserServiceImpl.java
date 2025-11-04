package campus.ride.useCases;

import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.User;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.exception.UserAlreadyExistsException;
import campus.ride.interfaces.EmailService;
import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.VerificationRequestDto;
import campus.ride.transfer.mappings.UserMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final Cache verificationCache;

    public UserServiceImpl(UserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             EmailService emailService,
                             CacheManager cacheManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCache = cacheManager.getCache("verificationCache");
    }

    @Override
    public UserResponseDto findByEmail(String email) {
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
        return UserMapper.toDto(userOptional.get());
    }

    @Override
    public String registerUser(CreateUserRequestDto request) {
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
                request.getFaculty()
        );
        verificationCache.put(email, pendingData);
        emailService.sendVerificationEmail(email, verificationCode, request.getFirstName(), request.getLastName());

        logger.info("Successfully sent verification code to: {}", email);
        return "Registration successful. Please check your email (or console) to verify.";
    }

    @Override
    public UserResponseDto verifyUser(VerificationRequestDto request) {
        String email = request.getEmail().trim();
        logger.info("Attempting to verify user with email: {}", email);

        PendingUserData pendingData = verificationCache.get(email, PendingUserData.class);

        if (pendingData == null) {
            throw new BadRequestException("Invalid or expired verification code.");
        }
        if (!pendingData.getVerificationCode().equals(request.getVerificationCode())) {
            throw new BadRequestException("Invalid verification code.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(pendingData.getHashedPassword());
        user.setPhoneNumber(pendingData.getPhoneNumber());
        user.setFirstName(pendingData.getFirstName());
        user.setLastName(pendingData.getLastName());
        user.setFaculty(pendingData.getFaculty());

        User savedUser = userRepository.save(user);
        verificationCache.evict(email);

        logger.info("Successfully verified and created user with ID: {}", savedUser.getId());
        return UserMapper.toDto(savedUser);
    }

    private static class PendingUserData implements java.io.Serializable {
        private String hashedPassword;
        private String verificationCode;
        private String phoneNumber;
        private String firstName;
        private String lastName;
        private String faculty;

        public PendingUserData(String hashedPassword, String verificationCode, String phoneNumber,
                                 String firstName, String lastName, String faculty) {
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
        public String getFaculty() { return faculty; }
    }

    private String generateVerificationCode() {
        java.util.Random random = new java.util.Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

}
