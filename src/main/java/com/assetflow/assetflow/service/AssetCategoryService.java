package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.AssetCategory;
import com.assetflow.assetflow.repository.AssetCategoryRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetCategoryService {

    private final AssetCategoryRepository assetCategoryRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public List<AssetCategory> findAll() {
        return assetCategoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AssetCategory> findByOrganizationId(Long organizationId) {
        return assetCategoryRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public AssetCategory findById(Long id) {
        return assetCategoryRepository.findById(id).orElse(null);
    }

    @Transactional
    public AssetCategory create(AssetCategory category) {
        if (category.getOrganization() != null && category.getOrganization().getId() != null) {
            category.setOrganization(organizationRepository.findById(category.getOrganization().getId()).orElseThrow());
        }
        return assetCategoryRepository.save(category);
    }

    @Transactional
    public AssetCategory update(Long id, AssetCategory category) {
        AssetCategory existing = assetCategoryRepository.findById(id).orElse(null);
        if (existing == null) return null;
        if (category.getOrganization() != null && category.getOrganization().getId() != null) {
            existing.setOrganization(organizationRepository.findById(category.getOrganization().getId()).orElseThrow());
        }
        if (category.getName() != null) existing.setName(category.getName());
        return assetCategoryRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!assetCategoryRepository.existsById(id)) return false;
        assetCategoryRepository.deleteById(id);
        return true;
    }
}
