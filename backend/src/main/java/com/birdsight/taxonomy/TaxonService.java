package com.birdsight.taxonomy;

import com.birdsight.taxonomy.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaxonService {

    private final TaxonRepository taxonRepository;
    private final TaxonMapper taxonMapper;

    @Transactional(readOnly = true)
    public TaxonDetailResponse getTaxonDetail(UUID id) {
        Taxon taxon = taxonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Taxon not found: " + id));

        // 1. Observation count (recursive, including descendants)
        long observationCount = taxonRepository.countObservationsForTaxonAndDescendants(id);

        // 2. Build ancestor chain (walk up parent pointers)
        List<TaxonResponse> ancestors = buildAncestorChain(taxon);

        // 3. Children
        List<TaxonResponse> children = taxonRepository.findByParentId(id).stream()
                .map(taxonMapper::toResponse)
                .toList();
                
        // Combine ancestor and children ids to fetch all their observations counts
        List<UUID> taxaIdsToCount = new ArrayList<>();
        ancestors.forEach(a -> taxaIdsToCount.add(a.getId()));
        children.forEach(c -> taxaIdsToCount.add(c.getId()));
        
        if (!taxaIdsToCount.isEmpty()) {
            List<TaxonObservationCountProjection> counts = taxonRepository.countObservationsForTaxa(taxaIdsToCount);
            for (TaxonObservationCountProjection countProj : counts) {
                ancestors.stream().filter(a -> a.getId().equals(countProj.getId())).findFirst().ifPresent(a -> a.setObservationCount(countProj.getCount()));
                children.stream().filter(c -> c.getId().equals(countProj.getId())).findFirst().ifPresent(c -> c.setObservationCount(countProj.getCount()));
            }
        }

        // 4. Top Observer & Top Identifier
        TopObserverDto topObserverDto = null;
        TopIdentifierDto topIdentifierDto = null;
        if (observationCount > 0) {
            topObserverDto = taxonRepository.findTopObserverForTaxon(id)
                    .map(proj -> TopObserverDto.builder()
                            .userId(proj.getUserId())
                            .username(proj.getUsername())
                            .displayName(proj.getDisplayName())
                            .avatarUrl(proj.getAvatarUrl())
                            .observationCount(proj.getObservationCount())
                            .build())
                    .orElse(null);
                    
            topIdentifierDto = taxonRepository.findTopIdentifierForTaxon(id)
                    .map(proj -> TopIdentifierDto.builder()
                            .userId(proj.getUserId())
                            .username(proj.getUsername())
                            .displayName(proj.getDisplayName())
                            .avatarUrl(proj.getAvatarUrl())
                            .identificationCount(proj.getIdentificationCount())
                            .build())
                    .orElse(null);
        }

        // 5. Cover image — prefer curator override, then recent observation image
        String coverImageUrl = taxon.getCoverImageUrl();
        List<RecentObservationProjection> recentProjections = taxonRepository
                .findRecentObservationImagesForTaxon(id, 6);

        if (coverImageUrl == null && !recentProjections.isEmpty()) {
            coverImageUrl = recentProjections.getFirst().getImageUrl();
        }

        List<RecentObservationDto> recentObservations = recentProjections.stream()
                .map(p -> new RecentObservationDto(p.getId(), p.getImageUrl()))
                .toList();

        return taxonMapper.toDetailResponse(
                taxon, observationCount, ancestors, children,
                coverImageUrl,
                recentObservations, topObserverDto, topIdentifierDto
        );
    }

    @Transactional
    public TaxonDetailResponse updateTaxonDetails(UUID id, UpdateTaxonRequest request) {
        Taxon taxon = taxonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Taxon not found: " + id));

        if (request.getCoverImageUrl() != null) {
            taxon.setCoverImageUrl(request.getCoverImageUrl());
        }

        taxonRepository.save(taxon);
        return getTaxonDetail(id);
    }

    @Transactional(readOnly = true)
    public Page<TaxonResponse> browseTaxa(TaxonRank rank, UUID parentId, String search, Pageable pageable) {
        if (search != null && !search.isBlank() && rank != null) {
            return taxonRepository.findByRankAndSearch(rank, search.trim(), pageable)
                    .map(taxonMapper::toResponse);
        }
        if (rank != null) {
            return taxonRepository.findByRank(rank, pageable).map(taxonMapper::toResponse);
        }
        if (parentId != null) {
            return taxonRepository.findByParentId(parentId, pageable).map(taxonMapper::toResponse);
        }
        if (search != null && !search.isBlank()) {
            return taxonRepository.searchByName(search.trim(), pageable).map(taxonMapper::toResponse);
        }
        return taxonRepository.findAll(pageable).map(taxonMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public long getObservationCount(UUID taxonId) {
        return taxonRepository.countObservationsForTaxonAndDescendants(taxonId);
    }

    private List<TaxonResponse> buildAncestorChain(Taxon taxon) {
        List<TaxonResponse> ancestors = new ArrayList<>();
        Taxon current = taxon.getParent();
        while (current != null) {
            ancestors.add(taxonMapper.toResponse(current));
            current = current.getParent();
        }
        Collections.reverse(ancestors);
        return ancestors;
    }
}
