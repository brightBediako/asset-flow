package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.dto.LoginRequest;
import com.assetflow.assetflow.dto.RegisterRequest;
import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.entity.Role;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.repository.RoleRepository;
import com.assetflow.assetflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid LoginRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userService.findByEmail(request.email());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        Long roleId = request.roleId();
        if (roleId == null) {
            roleId = roleRepository.findByName("User")
                    .map(Role::getId)
                    .orElse(null);
        }
        if (roleId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "roleId is required. Create a 'User' role via POST /api/roles first, or send roleId in the request body."));
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(Role.builder().id(roleId).build());
        if (request.organizationId() != null) {
            user.setOrganization(Organization.builder().id(request.organizationId()).build());
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
