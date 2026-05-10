package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.AssetCategory;
import com.assetflow.assetflow.exception.FieldValidationException;
import com.assetflow.assetflow.repository.AssetCategoryRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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
        return assetCategoryRepository.findGlobalAndOrganizationCategories(organizationId);
    }

    @Transactional(readOnly = true)
    public AssetCategory findById(Long id) {
        return assetCategoryRepository.findById(id).orElse(null);
    }

    @Transactional
    public AssetCategory create(AssetCategory category) {
        if (category.getName() == null || category.getName().isBlank()) {
            throw new FieldValidationException("Category name is required.", Map.of("name", "Required"));
        }
        category.setName(category.getName().trim());

        if (category.getOrganization() != null && category.getOrganization().getId() != null) {
            Long orgId = category.getOrganization().getId();
            category.setOrganization(organizationRepository.findById(orgId).orElseThrow());
            assetCategoryRepository.findByOrganizationIdAndName(orgId, category.getName())
                    .ifPresent(c -> {
                        throw new FieldValidationException(
                                "A category with this name already exists for this organization.",
                                Map.of("name", "Duplicate category name for organization"));
                    });
        } else {
            category.setOrganization(null);
            assetCategoryRepository.findByOrganizationIsNullAndName(category.getName())
                    .ifPresent(c -> {
                        throw new FieldValidationException(
                                "A global category with this name already exists.",
                                Map.of("name", "Duplicate global category name"));
                    });
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
