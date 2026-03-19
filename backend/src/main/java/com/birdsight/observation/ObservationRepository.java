package com.birdsight.observation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, UUID> {

    @Query("SELECT o FROM Observation o WHERE o.deleted = false ORDER BY o.createdAt DESC")
    Page<Observation> findAllActive(Pageable pageable);

    @Query("SELECT o FROM Observation o WHERE o.deleted = false AND o.user.id = :userId ORDER BY o.createdAt DESC")
    Page<Observation> findByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT o FROM Observation o WHERE o.deleted = false AND o.qualityGrade = :grade ORDER BY o.createdAt DESC")
    Page<Observation> findByQualityGrade(@Param("grade") QualityGrade grade, Pageable pageable);

    Optional<Observation> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT o FROM Observation o LEFT JOIN FETCH o.images WHERE o.id = :id AND o.deleted = false")
    Optional<Observation> findByIdWithImages(@Param("id") UUID id);
}
