package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.exception.FieldValidationException;
import com.assetflow.assetflow.repository.AssetCategoryRepository;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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
    public Page<Asset> search(Long organizationId, String query, Pageable pageable) {
        String normalizedQuery = (query == null || query.isBlank()) ? null : query.trim();
        return assetRepository.search(organizationId, normalizedQuery, pageable);
    }

    @Transactional(readOnly = true)
    public Asset findById(Long id) {
        return assetRepository.findById(id).orElse(null);
    }

    @Transactional
    public Asset create(Asset asset) {
        Long organizationId = resolveRequiredOrganizationId(asset);
        Long categoryId = resolveRequiredCategoryId(asset);
        asset.setOrganization(organizationRepository.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found")));
        asset.setCategory(assetCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found")));
        validateCategoryBelongsToOrganization(asset);
        return assetRepository.save(asset);
    }

    @Transactional
    public Asset update(Long id, Asset asset) {
        Asset existing = assetRepository.findById(id).orElse(null);
        if (existing == null) return null;
        Long organizationId = resolveRequiredOrganizationId(asset);
        Long categoryId = resolveRequiredCategoryId(asset);
        existing.setOrganization(organizationRepository.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found")));
        existing.setCategory(assetCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found")));
        validateCategoryBelongsToOrganization(existing);
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

    private Long resolveRequiredOrganizationId(Asset asset) {
        if (asset.getOrganization() == null || asset.getOrganization().getId() == null) {
            throw new FieldValidationException(
                    "Request validation failed",
                    Map.of("organization.id", "Organization is required")
            );
        }
        return asset.getOrganization().getId();
    }

    private Long resolveRequiredCategoryId(Asset asset) {
        if (asset.getCategory() == null || asset.getCategory().getId() == null) {
            throw new FieldValidationException(
                    "Request validation failed",
                    Map.of("category.id", "Category is required")
            );
        }
        return asset.getCategory().getId();
    }

    private void validateCategoryBelongsToOrganization(Asset asset) {
        if (asset.getCategory() == null || asset.getCategory().getOrganization() == null) {
            throw new IllegalArgumentException("Category organization is invalid");
        }
        if (!asset.getCategory().getOrganization().getId().equals(asset.getOrganization().getId())) {
            throw new FieldValidationException(
                    "Request validation failed",
                    Map.of("category.id", "Category must belong to the selected organization")
            );
        }
    }
}
