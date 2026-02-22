package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.repository.AssetCategoryRepository;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final OrganizationRepository organizationRepository;
    private final AssetCategoryRepository assetCategoryRepository;

    @Transactional(readOnly = true)
    public List<Asset> findAll() {
        return assetRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Asset> findByOrganizationId(Long organizationId) {
        return assetRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public Asset findById(Long id) {
        return assetRepository.findById(id).orElse(null);
    }

    @Transactional
    public Asset create(Asset asset) {
        if (asset.getOrganization() != null && asset.getOrganization().getId() != null) {
            asset.setOrganization(organizationRepository.findById(asset.getOrganization().getId()).orElseThrow());
        }
        if (asset.getCategory() != null && asset.getCategory().getId() != null) {
            asset.setCategory(assetCategoryRepository.findById(asset.getCategory().getId()).orElse(null));
        }
        return assetRepository.save(asset);
    }

    @Transactional
    public Asset update(Long id, Asset asset) {
        Asset existing = assetRepository.findById(id).orElse(null);
        if (existing == null) return null;
        if (asset.getOrganization() != null && asset.getOrganization().getId() != null) {
            existing.setOrganization(organizationRepository.findById(asset.getOrganization().getId()).orElseThrow());
        }
        if (asset.getCategory() != null && asset.getCategory().getId() != null) {
            existing.setCategory(assetCategoryRepository.findById(asset.getCategory().getId()).orElse(null));
        }
        if (asset.getName() != null) existing.setName(asset.getName());
        if (asset.getDescription() != null) existing.setDescription(asset.getDescription());
        if (asset.getStatus() != null) existing.setStatus(asset.getStatus());
        if (asset.getImageUrl() != null) existing.setImageUrl(asset.getImageUrl());
        return assetRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!assetRepository.existsById(id)) return false;
        assetRepository.deleteById(id);
        return true;
    }
}
