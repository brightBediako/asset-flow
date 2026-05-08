package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.AuditLog;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.service.AuditLogService;
import com.assetflow.assetflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<AuditLog>> list(
            @RequestParam(required = false) Long organizationId,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        if (organizationId != null) {
            return ResponseEntity.ok(auditLogService.findByOrganizationId(organizationId, pageable));
        }

        User current = authentication != null && authentication.getName() != null
                ? userService.findByEmail(authentication.getName())
                : null;
        if (current != null && current.getOrganization() != null) {
            return ResponseEntity.ok(auditLogService.findByOrganizationId(current.getOrganization().getId(), pageable));
        }
        return ResponseEntity.ok(auditLogService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLog> getById(@PathVariable Long id) {
        AuditLog log = auditLogService.findById(id);
        return log != null ? ResponseEntity.ok(log) : ResponseEntity.notFound().build();
    }
}
