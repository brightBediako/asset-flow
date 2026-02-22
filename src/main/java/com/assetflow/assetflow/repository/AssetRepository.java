package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.entity.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByOrganizationId(Long organizationId);

    List<Asset> findByOrganizationIdAndStatus(Long organizationId, AssetStatus status);
}
