package com.assetflow.assetflow.controller;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public ResponseEntity<List<Asset>> list(@RequestParam(required = false) Long organizationId) {
        List<Asset> list = organizationId != null
                ? assetService.findByOrganizationId(organizationId)
                : assetService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Asset>> search(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(assetService.search(organizationId, query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getById(@PathVariable Long id) {
        Asset asset = assetService.findById(id);
        return asset != null ? ResponseEntity.ok(asset) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Asset> create(@RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.create(asset));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> update(@PathVariable Long id, @RequestBody Asset asset) {
        Asset updated = assetService.update(id, asset);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return assetService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
