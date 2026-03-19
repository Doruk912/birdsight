package com.birdsight.observation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ObservationImageRepository extends JpaRepository<ObservationImage, UUID> {

    List<ObservationImage> findByObservationIdOrderByPositionAsc(UUID observationId);
}
