package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.dto.LoginRequest;
import com.assetflow.assetflow.dto.RegisterRequest;
import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.entity.Role;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.repository.RoleRepository;
import com.assetflow.assetflow.service.OrganizationService;
import com.assetflow.assetflow.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final String USER_ROLE = "USER";
    private static final String ORG_ADMIN_ROLE = "ORG_ADMIN";
    private static final String ORGANIZATION_ACCOUNT_TYPE = "ORGANIZATION";

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final OrganizationService organizationService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid LoginRequest request, HttpServletRequest servletRequest) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        servletRequest.getSession(true)
                .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        User user = userService.findByEmail(request.email());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterRequest request) {
        String accountType = normalizeAccountType(request.accountType());
        boolean organizationAccount = ORGANIZATION_ACCOUNT_TYPE.equals(accountType);
        String targetRole = organizationAccount ? ORG_ADMIN_ROLE : USER_ROLE;

        Long roleId = request.roleId() != null ? request.roleId() : resolveRoleId(targetRole);
        if (roleId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error",
                    "Missing required role '" + targetRole + "'. Create it via POST /api/roles first or send roleId."));
        }

        Long organizationId = request.organizationId();
        String location = request.location() == null ? null : request.location().trim();
        if (organizationAccount) {
            String orgName = request.organizationName() == null ? "" : request.organizationName().trim();
            if (orgName.isBlank()) {
                orgName = "ORG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            }
            Organization createdOrganization = organizationService.create(
                    Organization.builder().name(orgName).location(location).build());
            organizationId = createdOrganization.getId();
        } else if (organizationId == null) {
            String generatedName = request.fullName().trim() + " Workspace";
            Organization generatedOrganization = organizationService.create(
                    Organization.builder().name(generatedName).location(location).build());
            organizationId = generatedOrganization.getId();
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setLocation(location);
        user.setRole(Role.builder().id(roleId).build());
        if (organizationId != null) {
            user.setOrganization(Organization.builder().id(organizationId).build());
        }
        return ResponseEntity.ok(userService.create(user));
    }

    private Long resolveRoleId(String roleName) {
        if (USER_ROLE.equals(roleName)) {
            return roleRepository.findByName(USER_ROLE)
                    .or(() -> roleRepository.findByName("User"))
                    .map(Role::getId)
                    .orElse(null);
        }
        if (ORG_ADMIN_ROLE.equals(roleName)) {
            return roleRepository.findByName(ORG_ADMIN_ROLE)
                    .or(() -> roleRepository.findByName("Org Admin"))
                    .or(() -> roleRepository.findByName("ORG ADMIN"))
                    .map(Role::getId)
                    .orElse(null);
        }
        return roleRepository.findByName(roleName).map(Role::getId).orElse(null);
    }

    private String normalizeAccountType(String accountType) {
        String normalized = accountType == null ? "" : accountType.trim().toUpperCase();
        return normalized.isBlank() ? USER_ROLE : normalized;
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || authentication instanceof AnonymousAuthenticationToken
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.status(401).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
