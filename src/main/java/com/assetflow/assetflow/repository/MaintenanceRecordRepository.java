package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByOrganizationId(Long organizationId);

    List<MaintenanceRecord> findByAssetId(Long assetId);
}
