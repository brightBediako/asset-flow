package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.MaintenanceRecord;
import com.assetflow.assetflow.service.MaintenanceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-records")
@RequiredArgsConstructor
public class MaintenanceRecordController {

    private final MaintenanceRecordService maintenanceRecordService;

    @GetMapping
    public ResponseEntity<List<MaintenanceRecord>> list(@RequestParam(required = false) Long organizationId) {
        List<MaintenanceRecord> list = organizationId != null
                ? maintenanceRecordService.findByOrganizationId(organizationId)
                : maintenanceRecordService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> getById(@PathVariable Long id) {
        MaintenanceRecord record = maintenanceRecordService.findById(id);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecord> create(@RequestBody MaintenanceRecord record) {
        return ResponseEntity.ok(maintenanceRecordService.create(record));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> update(@PathVariable Long id, @RequestBody MaintenanceRecord record) {
        MaintenanceRecord updated = maintenanceRecordService.update(id, record);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return maintenanceRecordService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
