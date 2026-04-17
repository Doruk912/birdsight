package com.birdsight.observation;

import com.birdsight.identification.IdentificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ObservationQualityRecomputer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ObservationQualityRecomputer.class);

    private final ObservationRepository observationRepository;
    private final IdentificationRepository identificationRepository;
    private final ObservationService observationService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting observation quality grade recomputation for existing data...");
        List<Observation> observations = observationRepository.findAll();
        for (Observation obs : observations) {
            try {
                if (obs.isDeleted()) continue;
                List<UUID> currentTaxonIds = identificationRepository
                        .findCurrentByObservationId(obs.getId()).stream()
                        .map(id -> id.getTaxon().getId())
                        .toList();
                observationService.recomputeQualityGrade(obs.getId(), currentTaxonIds);
            } catch (Exception e) {
                log.error("Failed to recompute observation " + obs.getId(), e);
            }
        }
        log.info("Observation quality grade recomputation completed.");
    }
}
