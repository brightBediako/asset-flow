package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.RoleRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

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
        return userRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!userRepository.existsById(id)) return false;
        userRepository.deleteById(id);
        return true;
    }
}
