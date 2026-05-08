package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

    List<AssetCategory> findByOrganizationId(Long organizationId);

    @Query("""
            SELECT c
            FROM AssetCategory c
            WHERE c.organization IS NULL OR c.organization.id = :organizationId
            ORDER BY c.name ASC
            """)
    List<AssetCategory> findGlobalAndOrganizationCategories(Long organizationId);

    Optional<AssetCategory> findByOrganizationIdAndName(Long organizationId, String name);
}
