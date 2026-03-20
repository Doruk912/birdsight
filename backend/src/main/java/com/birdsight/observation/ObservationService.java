package com.birdsight.observation;

import com.birdsight.common.exception.BadRequestException;
import com.birdsight.common.exception.ResourceNotFoundException;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public Page<ObservationResponse> getAllObservations(String search, QualityGrade grade, Pageable pageable) {
        if ((search == null || search.trim().isEmpty()) && grade == null) {
            return observationRepository.findAllActive(pageable)
                    .map(obs -> observationMapper.toResponse(obs, 0, 0));
        }
        String searchQuery = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return observationRepository.findAllWithFilters(searchQuery, grade, pageable)
                .map(obs -> observationMapper.toResponse(obs, 0, 0));
    }

    @Transactional(readOnly = true)
    public Page<ObservationResponse> getObservationsByUser(UUID userId, Pageable pageable) {
        return observationRepository.findByUserId(userId, pageable)
                .map(obs -> observationMapper.toResponse(obs, 0, 0));
    }

    @Transactional(readOnly = true)
    public ObservationResponse getObservationById(UUID id) {
        Observation obs = observationRepository.findByIdWithImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", id));
        return observationMapper.toResponse(obs, 0, 0);
    }

    @Transactional(readOnly = true)
    public List<ObservationMapResponse> getMapObservations() {
        return observationRepository.findAllActive(Pageable.unpaged())
                .map(observationMapper::toMapResponse)
                .getContent();
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

        // Count votes per taxon
        Map<UUID, Long> voteCounts = currentTaxonIds.stream()
                .collect(Collectors.groupingBy(id -> id, Collectors.counting()));

        long totalVotes = currentTaxonIds.size();

        // Find the taxon with the most votes
        Map.Entry<UUID, Long> topEntry = voteCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        if (topEntry == null) {
            obs.setCommunityTaxon(null);
            obs.setQualityGrade(QualityGrade.NEEDS_ID);
        } else {
            Taxon topTaxon = taxonRepository.findById(topEntry.getKey()).orElse(null);
            obs.setCommunityTaxon(topTaxon);

            // Research Grade if ≥ 2 IDs and ≥ 2/3 agree on the same species-level taxon
            boolean hasConsensus = totalVotes >= 2 && topEntry.getValue() * 3 >= totalVotes * 2;
            boolean isSpeciesLevel = topTaxon != null && topTaxon.getRank().name().equals("SPECIES");

            if (hasConsensus && isSpeciesLevel) {
                obs.setQualityGrade(QualityGrade.RESEARCH_GRADE);
            } else {
                obs.setQualityGrade(QualityGrade.NEEDS_ID);
            }
        }

        observationRepository.saveAndFlush(obs);
    }
}
