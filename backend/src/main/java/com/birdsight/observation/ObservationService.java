package com.birdsight.observation;

import com.birdsight.comment.CommentRepository;
import com.birdsight.common.exception.BadRequestException;
import com.birdsight.common.exception.ResourceNotFoundException;
import com.birdsight.identification.IdentificationRepository;
import com.birdsight.observation.dto.*;
import com.birdsight.storage.StorageService;
import com.birdsight.taxonomy.Taxon;
import com.birdsight.taxonomy.TaxonRepository;
import com.birdsight.user.User;
import com.birdsight.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ObservationService {

    private static final int MAX_IMAGES = 5;
    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    private final ObservationRepository observationRepository;
    private final ObservationImageRepository imageRepository;
    private final ObservationMapper observationMapper;
    private final UserRepository userRepository;
    private final TaxonRepository taxonRepository;
    private final StorageService storageService;
    private final IdentificationRepository identificationRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public ObservationResponse createObservation(String userEmail, CreateObservationRequest request,
                                                  List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            throw new BadRequestException("At least 1 image is required.");
        }
        if (images.size() > MAX_IMAGES) {
            throw new BadRequestException("Maximum " + MAX_IMAGES + " images allowed.");
        }

        User user = userRepository.findByEmailAndDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Observation observation = Observation.builder()
                .user(user)
                .description(request.getDescription())
                .observedAt(Instant.parse(request.getObservedAt()))
                .location(GEOMETRY_FACTORY.createPoint(new Coordinate(request.getLongitude(), request.getLatitude())))
                .locationName(request.getLocationName())
                .qualityGrade(QualityGrade.NEEDS_ID)
                .build();

        Observation saved = observationRepository.saveAndFlush(observation);

        // Upload images to MinIO
        for (int i = 0; i < images.size(); i++) {
            String imageUrl = storageService.uploadObservationImage(saved.getId(), images.get(i));
            ObservationImage obsImage = ObservationImage.builder()
                    .observation(saved)
                    .imageUrl(imageUrl)
                    .position(i)
                    .build();
            imageRepository.save(obsImage);
            saved.getImages().add(obsImage);
        }

        return observationMapper.toResponse(saved, 0, 0);
    }

    @Transactional(readOnly = true)
    public Page<ObservationResponse> getAllObservations(ObservationFilterRequest filter, Pageable pageable) {
        // Resolve descendant taxon IDs if a taxon filter is specified
        List<UUID> descendantIds = null;
        if (filter.getTaxonId() != null) {
            descendantIds = taxonRepository.findDescendantIds(filter.getTaxonId());
        }

        Specification<Observation> spec = ObservationSpecification.withFilters(filter, descendantIds);
        return observationRepository.findAll(spec, pageable)
                .map(obs -> {
                    int idCount = (int) identificationRepository.countByObservationId(obs.getId());
                    int cmtCount = (int) commentRepository.countByObservationIdAndDeletedFalse(obs.getId());
                    return observationMapper.toResponse(obs, idCount, cmtCount);
                });
    }

    @Transactional(readOnly = true)
    public Page<ObservationResponse> getObservationsByUser(UUID userId, Pageable pageable) {
        return observationRepository.findByUserId(userId, pageable)
                .map(obs -> {
                    int idCount = (int) identificationRepository.countByObservationId(obs.getId());
                    int cmtCount = (int) commentRepository.countByObservationIdAndDeletedFalse(obs.getId());
                    return observationMapper.toResponse(obs, idCount, cmtCount);
                });
    }

    @Transactional(readOnly = true)
    public ObservationResponse getObservationById(UUID id) {
        Observation obs = observationRepository.findByIdWithImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", id));
        int idCount = (int) identificationRepository.countByObservationId(id);
        int cmtCount = (int) commentRepository.countByObservationIdAndDeletedFalse(id);
        return observationMapper.toResponse(obs, idCount, cmtCount);
    }

    @Transactional(readOnly = true)
    public List<ObservationMapResponse> getMapObservations(ObservationFilterRequest filter) {
        // Resolve descendant taxon IDs if a taxon filter is specified
        List<UUID> descendantIds = null;
        if (filter.getTaxonId() != null) {
            descendantIds = taxonRepository.findDescendantIds(filter.getTaxonId());
        }

        Specification<Observation> spec = ObservationSpecification.withFilters(filter, descendantIds);
        return observationRepository.findAll(spec)
                .stream()
                .map(observationMapper::toMapResponse)
                .toList();
    }

    @Transactional
    public void deleteObservation(UUID id, String userEmail) {
        Observation obs = observationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", id));
        if (!obs.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only delete your own observations.");
        }
        obs.setDeleted(true);
        observationRepository.saveAndFlush(obs);
    }

    /**
     * Recomputes the community taxon and quality grade based on current identifications.
     * Called whenever an identification is added or withdrawn.
     */
    @Transactional
    public void recomputeQualityGrade(UUID observationId, List<UUID> currentTaxonIds) {
        Observation obs = observationRepository.findByIdAndDeletedFalse(observationId)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", observationId));

        if (currentTaxonIds.isEmpty()) {
            obs.setCommunityTaxon(null);
            obs.setQualityGrade(QualityGrade.NEEDS_ID);
            observationRepository.saveAndFlush(obs);
            return;
        }

        List<Taxon> currentTaxa = taxonRepository.findAllById(currentTaxonIds);
        
        // 1. Build lineages for all current identifications
        List<List<Taxon>> lineages = new ArrayList<>();
        for (Taxon taxon : currentTaxa) {
            List<Taxon> lineage = new ArrayList<>();
            Taxon cur = taxon;
            while (cur != null) {
                lineage.addFirst(cur);
                cur = cur.getParent();
            }
            lineages.add(lineage);
        }

        // 2. Find community taxon by descending the tree where consensus exists
        // A taxon is acceptable if > 2/3 of IDs don't disagree with it.
        // Disagreement = ID is in a different branch (neither ancestor nor descendant).
        Taxon communityTaxon = lineages.getFirst().getFirst(); // Start at Root (all lineages must share a root)
        int depth = 0;
        
        while (true) {
            // Find all unique children of the current communityTaxon that appear in the lineages
            Map<UUID, Taxon> childrenMap = new HashMap<>();
            for (List<Taxon> lineage : lineages) {
                if (lineage.size() > depth + 1 && lineage.get(depth).getId().equals(communityTaxon.getId())) {
                    Taxon child = lineage.get(depth + 1);
                    childrenMap.put(child.getId(), child);
                }
            }
            
            if (childrenMap.isEmpty()) break;
            
            Taxon bestChild = null;
            long bestSupport = -1;
            
            for (Taxon candidate : childrenMap.values()) {
                long disagreement = 0;
                long support = 0; // Explicit support (is candidate or descendant)
                
                for (List<Taxon> lineage : lineages) {
                    if (lineage.size() > depth + 1 && lineage.get(depth + 1).getId().equals(candidate.getId())) {
                        // This ID follows this branch
                        support++;
                    } else if (lineage.size() > depth + 1) {
                        // This ID follows a different branch at this level
                        disagreement++;
                    }
                    // If lineage.size() <= depth + 1, it's an ancestor/parent ID which doesn't disagree
                }
                
                // Consensus threshold: > 2/3 of IDs must NOT disagree
                long totalVotes = currentTaxonIds.size();
                if ((totalVotes - disagreement) * 3 > totalVotes * 2) {
                    // This child is a valid candidate for consensus.
                    // If multiple children are valid (e.g. some IDs are vague), pick the one with more direct support.
                    if (support > bestSupport) {
                        bestSupport = support;
                        bestChild = candidate;
                    }
                }
            }
            
            if (bestChild != null) {
                communityTaxon = bestChild;
                depth++;
            } else {
                break;
            }
        }
        
        obs.setCommunityTaxon(communityTaxon);

        // 3. Determine Quality Grade
        // Only Research Grade if community taxon is at species level AND we have at least 2 IDs
        boolean isSpeciesLevel = communityTaxon.getRank().name().equals("SPECIES");
        if (isSpeciesLevel && currentTaxonIds.size() >= 2) {
            obs.setQualityGrade(QualityGrade.RESEARCH_GRADE);
        } else {
            obs.setQualityGrade(QualityGrade.NEEDS_ID);
        }

        observationRepository.saveAndFlush(obs);
    }
}
