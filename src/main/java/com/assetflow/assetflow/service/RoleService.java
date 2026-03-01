package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Role;
import com.assetflow.assetflow.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role findById(Long id) {
        return roleRepository.findById(id).orElse(null);
    }

    @Transactional
    public Role create(Role role) {
        return roleRepository.save(role);
    }

    @Transactional
    public Role update(Long id, Role role) {
        Role existing = roleRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(role.getName());
        return roleRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!roleRepository.existsById(id)) return false;
        roleRepository.deleteById(id);
        return true;
    }
}
