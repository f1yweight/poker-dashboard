package com.flyweight.poker_dashboard.user;

import com.flyweight.poker_dashboard.user.dto.LoginUserRequest;
import com.flyweight.poker_dashboard.user.dto.RegisterUserRequest;
import com.flyweight.poker_dashboard.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> findAll() {
        return userService.findAll();
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginUserRequest request) {
        return userService.login(request);
    }
}
