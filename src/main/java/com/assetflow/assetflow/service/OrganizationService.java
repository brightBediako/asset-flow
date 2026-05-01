package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Organization findById(Long id) {
        return organizationRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public Page<Organization> search(String query, Pageable pageable) {
        String normalizedQuery = (query == null || query.isBlank()) ? "" : query.trim();
        return organizationRepository.search(normalizedQuery, pageable);
    }

    @Transactional
    public Organization create(Organization organization) {
        return organizationRepository.save(organization);
    }

    @Transactional
    public Organization update(Long id, Organization organization) {
        Organization existing = organizationRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(organization.getName());
        return organizationRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!organizationRepository.existsById(id)) return false;
        organizationRepository.deleteById(id);
        return true;
    }
}
