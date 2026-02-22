package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.AuditLog;
import com.assetflow.assetflow.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public Page<AuditLog> findByOrganizationId(Long organizationId, Pageable pageable) {
        return auditLogRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public AuditLog findById(Long id) {
        return auditLogRepository.findById(id).orElse(null);
    }
}
