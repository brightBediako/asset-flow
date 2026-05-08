package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.Booking;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.service.BookingService;
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
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Booking>> list(@RequestParam(required = false) Long organizationId,
                                              Authentication authentication) {
        Long effectiveUserId = isAdmin(authentication) ? null : currentUserId(authentication);
        List<Booking> list;
        if (effectiveUserId != null) {
            list = bookingService.findByUserId(effectiveUserId);
        } else if (organizationId != null) {
            list = bookingService.findByOrganizationId(organizationId);
        } else {
            list = bookingService.findAll();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Booking>> search(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        boolean superAdmin = hasRole(authentication, "SUPER_ADMIN");
        boolean orgAdmin = hasRole(authentication, "ORG_ADMIN");

        Long effectiveUserId;
        Long effectiveOrganizationId;
        if (superAdmin) {
            effectiveUserId = userId;
            effectiveOrganizationId = organizationId;
        } else if (orgAdmin) {
            effectiveUserId = userId;
            effectiveOrganizationId = organizationId != null ? organizationId : currentOrganizationId(authentication);
        } else {
            effectiveUserId = currentUserId(authentication);
            effectiveOrganizationId = null;
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(bookingService.search(effectiveOrganizationId, effectiveUserId, query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id, Authentication authentication) {
        Booking booking = bookingService.findById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        if (!isAdmin(authentication) && !isOwner(authentication, booking)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.create(booking));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Long id, @RequestBody Booking booking, Authentication authentication) {
        Booking existing = bookingService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        if (!isAdmin(authentication) && !isOwner(authentication, existing)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Booking updated = bookingService.update(id, booking);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        Booking existing = bookingService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        if (!isAdmin(authentication) && !isOwner(authentication, existing)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return bookingService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return hasRole(authentication, "SUPER_ADMIN") || hasRole(authentication, "ORG_ADMIN");
    }

    private boolean hasRole(Authentication authentication, String role) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> role.equals(authority.getAuthority()));
    }

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        var user = userService.findByEmail(authentication.getName());
        return user != null ? user.getId() : null;
    }

    private boolean isOwner(Authentication authentication, Booking booking) {
        Long userId = currentUserId(authentication);
        if (userId == null || booking == null || booking.getUser() == null || booking.getUser().getId() == null) {
            return false;
        }
        return userId.equals(booking.getUser().getId());
    }

    private Long currentOrganizationId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        User current = userService.findByEmail(authentication.getName());
        return current != null && current.getOrganization() != null ? current.getOrganization().getId() : null;
    }
}
