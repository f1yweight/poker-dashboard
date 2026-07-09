package com.flyweight.poker_dashboard.user;

import com.flyweight.poker_dashboard.dailyentry.mapper.UserMapper;
import com.flyweight.poker_dashboard.security.JwtService;
import com.flyweight.poker_dashboard.user.dto.LoginUserRequest;
import com.flyweight.poker_dashboard.user.dto.LoginUserResponse;
import com.flyweight.poker_dashboard.user.dto.RegisterUserRequest;
import com.flyweight.poker_dashboard.user.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder
            , UserMapper userMapper, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
    }

    public UserResponse register(RegisterUserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public LoginUserResponse login(LoginUserRequest request) {
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return userMapper.toLoginUserResponse(user, token);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
