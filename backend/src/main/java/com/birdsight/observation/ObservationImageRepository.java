package com.birdsight.observation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ObservationImageRepository extends JpaRepository<ObservationImage, UUID> {

    List<ObservationImage> findByObservationIdOrderByPositionAsc(UUID observationId);

    /**
     * Returns all observation images with their parent {@link Observation} eagerly
     * initialised. Used by the startup migration runner which operates outside a
     * JPA session and therefore cannot trigger lazy loading.
     */
    @Query("SELECT oi FROM ObservationImage oi JOIN FETCH oi.observation")
    List<ObservationImage> findAllWithObservation();
}
