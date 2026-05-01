package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.exception.FieldValidationException;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.RoleRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Pattern GHANA_PHONE_PATTERN = Pattern.compile("^(?:\\+233|0)\\d{9}$");

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<User> findByOrganizationId(Long organizationId) {
        return userRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public Page<User> search(Long organizationId, String query, Pageable pageable) {
        String normalizedQuery = (query == null || query.isBlank()) ? "" : query.trim();
        return userRepository.search(organizationId, normalizedQuery, pageable);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Transactional
    public User create(User user) {
        if (user.getOrganization() != null && user.getOrganization().getId() != null) {
            user.setOrganization(organizationRepository.findById(user.getOrganization().getId()).orElse(null));
        }
        if (user.getRole() != null && user.getRole().getId() != null) {
            user.setRole(roleRepository.findById(user.getRole().getId()).orElseThrow());
        }
        if (user.getJobTitle() != null) {
            user.setJobTitle(user.getJobTitle().trim());
        }
        user.setPhoneNumber(normalizeAndValidateGhanaPhone(user.getPhoneNumber()));
        return userRepository.save(user);
    }

    @Transactional
    public User update(Long id, User user) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) return null;
        if (user.getOrganization() != null && user.getOrganization().getId() != null) {
            existing.setOrganization(organizationRepository.findById(user.getOrganization().getId()).orElse(null));
        }
        if (user.getRole() != null && user.getRole().getId() != null) {
            existing.setRole(roleRepository.findById(user.getRole().getId()).orElseThrow());
        }
        if (user.getEmail() != null) existing.setEmail(user.getEmail());
        if (user.getPasswordHash() != null) existing.setPasswordHash(user.getPasswordHash());
        if (user.getFullName() != null) existing.setFullName(user.getFullName());
        if (user.getJobTitle() != null) existing.setJobTitle(user.getJobTitle().trim());
        if (user.getPhoneNumber() != null) existing.setPhoneNumber(normalizeAndValidateGhanaPhone(user.getPhoneNumber()));
        return userRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!userRepository.existsById(id)) return false;
        userRepository.deleteById(id);
        return true;
    }

    private String normalizeAndValidateGhanaPhone(String rawPhoneNumber) {
        if (rawPhoneNumber == null) {
            return null;
        }
        String normalized = rawPhoneNumber.trim().replaceAll("\\s+", "");
        if (normalized.isBlank()) {
            return null;
        }
        if (!GHANA_PHONE_PATTERN.matcher(normalized).matches()) {
            throw new FieldValidationException(
                    "Request validation failed",
                    Map.of("phoneNumber", "Phone number must be a valid Ghana format (0XXXXXXXXX or +233XXXXXXXXX)")
            );
        }
        return normalized;
    }
}
