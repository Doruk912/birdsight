package com.birdsight.observation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, UUID>, JpaSpecificationExecutor<Observation> {

    @Query("SELECT o FROM Observation o WHERE o.deleted = false ORDER BY o.createdAt DESC")
    Page<Observation> findAllActive(Pageable pageable);

    @Query("SELECT o FROM Observation o WHERE o.deleted = false AND o.user.id = :userId ORDER BY o.createdAt DESC")
    Page<Observation> findByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT o FROM Observation o " +
           "LEFT JOIN o.communityTaxon t " +
           "WHERE o.deleted = false " +
           "AND (:search IS NULL OR LOWER(t.commonName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.scientificName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.locationName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:grade IS NULL OR o.qualityGrade = :grade) " +
           "ORDER BY o.createdAt DESC")
    Page<Observation> findAllWithFilters(@Param("search") String search, @Param("grade") QualityGrade grade, Pageable pageable);

    Optional<Observation> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT o FROM Observation o LEFT JOIN FETCH o.images WHERE o.id = :id AND o.deleted = false")
    Optional<Observation> findByIdWithImages(@Param("id") UUID id);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT o.* FROM observations o
            WHERE o.community_taxon_id IN (SELECT id FROM descendants)
            AND o.is_deleted = false
            ORDER BY o.created_at DESC
            """, nativeQuery = true)
    java.util.List<Observation> findByTaxonAndDescendants(@Param("taxonId") UUID taxonId);

    @Query("SELECT COUNT(o) FROM Observation o WHERE o.deleted = false AND o.user.id = :userId")
    long countObservationsByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(DISTINCT o.communityTaxon.id) FROM Observation o WHERE o.deleted = false AND o.user.id = :userId AND o.communityTaxon IS NOT NULL AND o.communityTaxon.rank = 'SPECIES'")
    long countDistinctSpeciesByUserId(@Param("userId") UUID userId);
}
