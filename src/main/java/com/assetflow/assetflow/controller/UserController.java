package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> list(@RequestParam(required = false) Long organizationId) {
        List<User> list = organizationId != null
                ? userService.findByOrganizationId(organizationId)
                : userService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<User>> search(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(userService.search(organizationId, query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication) && !isCurrentUser(authentication, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User user = userService.findById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        return ResponseEntity.ok(userService.create(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user, Authentication authentication) {
        if (!isAdmin(authentication) && !isCurrentUser(authentication, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User updated = userService.update(id, user);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return userService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "SUPER_ADMIN".equals(authority.getAuthority())
                        || "ORG_ADMIN".equals(authority.getAuthority()));
    }

    private boolean isCurrentUser(Authentication authentication, Long id) {
        if (authentication == null || authentication.getName() == null || id == null) {
            return false;
        }
        User current = userService.findByEmail(authentication.getName());
        return current != null && id.equals(current.getId());
    }
}
