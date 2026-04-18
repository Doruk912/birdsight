package com.birdsight.identification;

import com.birdsight.common.exception.BadRequestException;
import com.birdsight.common.exception.ResourceNotFoundException;
import com.birdsight.identification.dto.CreateIdentificationRequest;
import com.birdsight.identification.dto.IdentificationMapper;
import com.birdsight.identification.dto.IdentificationResponse;
import com.birdsight.observation.Observation;
import com.birdsight.observation.ObservationRepository;
import com.birdsight.observation.ObservationService;
import com.birdsight.taxonomy.Taxon;
import com.birdsight.taxonomy.TaxonRepository;
import com.birdsight.user.User;
import com.birdsight.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdentificationService {

    private final IdentificationRepository identificationRepository;
    private final IdentificationMapper identificationMapper;
    private final ObservationRepository observationRepository;
    private final ObservationService observationService;
    private final UserRepository userRepository;
    private final TaxonRepository taxonRepository;

    @Transactional
    public IdentificationResponse addIdentification(UUID observationId, String userEmail,
                                                      CreateIdentificationRequest request) {
        Observation observation = observationRepository.findByIdAndDeletedFalse(observationId)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", observationId));

        User user = userRepository.findByEmailAndDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Taxon taxon = taxonRepository.findById(request.getTaxonId())
                .orElseThrow(() -> new ResourceNotFoundException("Taxon", "id", request.getTaxonId()));

        // Mark any previous identification by this user on this observation as not current
        List<Identification> previousIds = identificationRepository
                .findCurrentByObservationId(observationId).stream()
                .filter(id -> id.getUser().getId().equals(user.getId()))
                .toList();
        for (Identification prev : previousIds) {
            prev.setCurrent(false);
            identificationRepository.save(prev);
        }

        Identification identification = Identification.builder()
                .observation(observation)
                .user(user)
                .taxon(taxon)
                .comment(request.getComment())
                .build();

        Identification saved = identificationRepository.saveAndFlush(identification);

        // Recompute community taxon and quality grade
        recomputeForObservation(observationId);

        List<Identification> allIds = identificationRepository.findByObservationIdOrderByCreatedAtAsc(observationId);
        IdentificationResponse response = identificationMapper.toResponse(saved);
        response.setDisagreeing(checkDisagreement(saved, allIds));
        
        return response;
    }

    @Transactional(readOnly = true)
    public List<IdentificationResponse> getIdentifications(UUID observationId) {
        List<Identification> ids = identificationRepository.findByObservationIdOrderByCreatedAtAsc(observationId);
        return ids.stream()
                .map(id -> {
                    IdentificationResponse resp = identificationMapper.toResponse(id);
                    resp.setDisagreeing(checkDisagreement(id, ids));
                    return resp;
                })
                .toList();
    }

    private boolean checkDisagreement(Identification target, List<Identification> allIds) {
        // Collect taxa of all active identifications created strictly before the target ID
        List<Taxon> priorTaxa = new java.util.ArrayList<>();
        for (Identification prior : allIds) {
            if (!prior.getCreatedAt().isBefore(target.getCreatedAt())) {
                break; // Since list is ordered by createdAt ascending, we can stop here
            }
            
            if (prior.isCurrent() && !prior.isWithdrawn()) {
                priorTaxa.add(prior.getTaxon());
            }
        }

        if (priorTaxa.isEmpty()) {
            return false;
        }

        Taxon priorCommunityTaxon = observationService.calculateCommunityTaxon(priorTaxa);
        if (priorCommunityTaxon == null) {
            return false;
        }
        
        return !isCompatible(target.getTaxon(), priorCommunityTaxon);
    }

    private boolean isCompatible(Taxon t1, Taxon t2) {
        if (t1.getId().equals(t2.getId())) return true;

        // Check lineage compatibility
        Taxon curr = t1;
        while (curr != null) {
            if (curr.getId().equals(t2.getId())) return true;
            curr = curr.getParent();
        }

        curr = t2;
        while (curr != null) {
            if (curr.getId().equals(t1.getId())) return true;
            curr = curr.getParent();
        }

        return false;
    }

    @Transactional
    public void withdrawIdentification(UUID observationId, UUID identificationId, String userEmail) {
        Identification identification = identificationRepository.findById(identificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Identification", "id", identificationId));

        if (!identification.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only withdraw your own identifications.");
        }
        if (!identification.getObservation().getId().equals(observationId)) {
            throw new BadRequestException("Identification does not belong to this observation.");
        }

        identification.setWithdrawn(true);
        identification.setCurrent(false);
        identificationRepository.saveAndFlush(identification);

        recomputeForObservation(observationId);
    }

    private void recomputeForObservation(UUID observationId) {
        List<UUID> currentTaxonIds = identificationRepository
                .findCurrentByObservationId(observationId).stream()
                .map(id -> id.getTaxon().getId())
                .toList();
        observationService.recomputeQualityGrade(observationId, currentTaxonIds);
    }
}
