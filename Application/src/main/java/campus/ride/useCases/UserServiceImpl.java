package campus.ride.useCases;

import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.User;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.exception.UserAlreadyExistsException;
import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.mappings.UserMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);
    
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
    public UserResponseDto createUser(CreateUserRequestDto request) {
        logger.info("Creating new user with email: {}", request.getEmail());
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().trim());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }
        
        User user = UserMapper.fromCreateRequest(request);
        User savedUser = userRepository.save(user);
        
        logger.info("Successfully created user with ID: {} and email: {}", savedUser.getId(), savedUser.getEmail());
        return UserMapper.toDto(savedUser);
    }
}
