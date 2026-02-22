package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.MaintenanceRecord;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.MaintenanceRecordRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final OrganizationRepository organizationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> findAll() {
        return maintenanceRecordRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> findByOrganizationId(Long organizationId) {
        return maintenanceRecordRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public MaintenanceRecord findById(Long id) {
        return maintenanceRecordRepository.findById(id).orElse(null);
    }

    @Transactional
    public MaintenanceRecord create(MaintenanceRecord record) {
        if (record.getOrganization() != null && record.getOrganization().getId() != null) {
            record.setOrganization(organizationRepository.findById(record.getOrganization().getId()).orElseThrow());
        }
        if (record.getAsset() != null && record.getAsset().getId() != null) {
            record.setAsset(assetRepository.findById(record.getAsset().getId()).orElseThrow());
        }
        if (record.getCreatedBy() != null && record.getCreatedBy().getId() != null) {
            record.setCreatedBy(userRepository.findById(record.getCreatedBy().getId()).orElse(null));
        }
        return maintenanceRecordRepository.save(record);
    }

    @Transactional
    public MaintenanceRecord update(Long id, MaintenanceRecord record) {
        MaintenanceRecord existing = maintenanceRecordRepository.findById(id).orElse(null);
        if (existing == null) return null;
        if (record.getDescription() != null) existing.setDescription(record.getDescription());
        if (record.getCompletedAt() != null) existing.setCompletedAt(record.getCompletedAt());
        return maintenanceRecordRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!maintenanceRecordRepository.existsById(id)) return false;
        maintenanceRecordRepository.deleteById(id);
        return true;
    }
}
