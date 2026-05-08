package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.entity.AssetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByOrganizationId(Long organizationId);

    List<Asset> findByOrganizationIdAndStatus(Long organizationId, AssetStatus status);

    @Query("""
            SELECT a
            FROM Asset a
            WHERE (:organizationId IS NULL OR a.organization.id = :organizationId)
              AND (
                :query = ''
                OR LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(a.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(a.category.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(CAST(a.status AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            """)
    Page<Asset> search(
            @Param("organizationId") Long organizationId,
            @Param("query") String query,
            Pageable pageable);
}
