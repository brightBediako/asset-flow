package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.dto.LoginRequest;
import com.assetflow.assetflow.dto.RegisterRequest;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userService.findByEmail(request.email());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        if (request.roleId() == null) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        if (request.roleId() != null) {
            user.setRole(com.assetflow.assetflow.entity.Role.builder().id(request.roleId()).build());
        }
        if (request.organizationId() != null) {
            user.setOrganization(com.assetflow.assetflow.entity.Organization.builder().id(request.organizationId()).build());
        }
        return ResponseEntity.ok(userService.create(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }
}
