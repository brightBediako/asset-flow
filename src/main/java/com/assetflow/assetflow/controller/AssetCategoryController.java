package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.AssetCategory;
import com.assetflow.assetflow.service.AssetCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asset-categories")
@RequiredArgsConstructor
public class AssetCategoryController {

    private final AssetCategoryService assetCategoryService;

    @GetMapping
    public ResponseEntity<List<AssetCategory>> list(@RequestParam(required = false) Long organizationId) {
        List<AssetCategory> list = organizationId != null
                ? assetCategoryService.findByOrganizationId(organizationId)
                : assetCategoryService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetCategory> getById(@PathVariable Long id) {
        AssetCategory category = assetCategoryService.findById(id);
        return category != null ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<AssetCategory> create(@RequestBody AssetCategory category, Authentication authentication) {
        if (isSuperAdmin(authentication)) {
            // Categories created by system admin are global for all organizations.
            category.setOrganization(null);
        }
        return ResponseEntity.ok(assetCategoryService.create(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetCategory> update(@PathVariable Long id, @RequestBody AssetCategory category, Authentication authentication) {
        if (isSuperAdmin(authentication) && category.getOrganization() != null) {
            // Prevent accidental scope narrowing by system admin.
            category.setOrganization(null);
        }
        AssetCategory updated = assetCategoryService.update(id, category);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return assetCategoryService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private boolean isSuperAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "SUPER_ADMIN".equals(a.getAuthority()));
    }
}
