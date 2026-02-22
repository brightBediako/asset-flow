package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<List<Organization>> list() {
        return ResponseEntity.ok(organizationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getById(@PathVariable Long id) {
        Organization org = organizationService.findById(id);
        return org != null ? ResponseEntity.ok(org) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Organization> create(@RequestBody Organization organization) {
        return ResponseEntity.ok(organizationService.create(organization));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> update(@PathVariable Long id, @RequestBody Organization organization) {
        Organization updated = organizationService.update(id, organization);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return organizationService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
