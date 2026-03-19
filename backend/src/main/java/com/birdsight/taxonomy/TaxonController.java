package com.birdsight.taxonomy;

import com.birdsight.taxonomy.dto.TaxonMapper;
import com.birdsight.taxonomy.dto.TaxonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/taxa")
@RequiredArgsConstructor
public class TaxonController {

    private final TaxonRepository taxonRepository;
    private final TaxonMapper taxonMapper;

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
}
