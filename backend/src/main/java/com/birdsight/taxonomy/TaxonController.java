package com.birdsight.taxonomy;

import com.birdsight.taxonomy.dto.TaxonDetailResponse;
import com.birdsight.taxonomy.dto.TaxonMapper;
import com.birdsight.taxonomy.dto.TaxonResponse;
import com.birdsight.taxonomy.dto.UpdateTaxonRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/taxa")
@RequiredArgsConstructor
public class TaxonController {

    private final TaxonRepository taxonRepository;
    private final TaxonMapper taxonMapper;
    private final TaxonService taxonService;

    @GetMapping
    public ResponseEntity<Page<TaxonResponse>> searchTaxa(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TaxonRank rank,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<TaxonResponse> results;
        if (search != null && !search.isBlank()) {
            results = taxonRepository.searchByName(search.trim(), pageable)
                    .map(taxonMapper::toResponse);
        } else {
            results = taxonRepository.findAll(pageable).map(taxonMapper::toResponse);
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaxonResponse> getTaxonById(@PathVariable UUID id) {
        return taxonRepository.findById(id)
                .map(taxonMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<TaxonResponse>> getChildren(@PathVariable UUID id) {
        List<TaxonResponse> children = taxonRepository.findByParentId(id).stream()
                .map(taxonMapper::toResponse)
                .toList();
        return ResponseEntity.ok(children);
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<TaxonDetailResponse> getTaxonDetail(@PathVariable UUID id) {
        try {
            TaxonDetailResponse detail = taxonService.getTaxonDetail(id);
            return ResponseEntity.ok(detail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/observation-count")
    public ResponseEntity<Long> getObservationCount(@PathVariable UUID id) {
        long count = taxonService.getObservationCount(id);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/root")
    public ResponseEntity<TaxonResponse> getRootTaxon() {
        return taxonRepository.findByParentIsNull()
                .map(taxonMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/browse")
    public ResponseEntity<Page<TaxonResponse>> browseTaxa(
            @RequestParam(required = false) TaxonRank rank,
            @RequestParam(required = false) UUID parentId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 30) Pageable pageable) {
        Page<TaxonResponse> results = taxonService.browseTaxa(rank, parentId, search, pageable);
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CURATOR', 'ADMIN')")
    public ResponseEntity<TaxonDetailResponse> updateTaxon(
            @PathVariable UUID id,
            @RequestBody UpdateTaxonRequest request) {
        try {
            TaxonDetailResponse detail = taxonService.updateTaxonDetails(id, request);
            return ResponseEntity.ok(detail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
