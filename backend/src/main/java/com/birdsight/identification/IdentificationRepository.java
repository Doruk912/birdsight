package com.birdsight.identification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IdentificationRepository extends JpaRepository<Identification, UUID> {

    List<Identification> findByObservationIdOrderByCreatedAtAsc(UUID observationId);

    @Query("SELECT i FROM Identification i WHERE i.observation.id = :obsId AND i.current = true AND i.withdrawn = false")
    List<Identification> findCurrentByObservationId(@Param("obsId") UUID observationId);

    long countByObservationId(UUID observationId);
}
