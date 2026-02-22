package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByOrganizationId(Long organizationId, Pageable pageable);

    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
}
