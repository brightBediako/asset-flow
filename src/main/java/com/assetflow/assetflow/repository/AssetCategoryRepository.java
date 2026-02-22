package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

    List<AssetCategory> findByOrganizationId(Long organizationId);

    Optional<AssetCategory> findByOrganizationIdAndName(Long organizationId, String name);
}
