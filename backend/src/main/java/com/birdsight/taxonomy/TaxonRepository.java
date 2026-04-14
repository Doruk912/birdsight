package com.birdsight.taxonomy;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaxonRepository extends JpaRepository<Taxon, UUID> {

    @Query("SELECT t FROM Taxon t WHERE " +
           "LOWER(t.scientificName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.commonName) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Taxon> searchByName(@Param("query") String query, Pageable pageable);

    List<Taxon> findByParentId(UUID parentId);

    List<Taxon> findByScientificNameIn(List<String> scientificNames);

    Optional<Taxon> findByParentIsNull();

    @Query("SELECT t FROM Taxon t WHERE t.rank = :rank AND " +
           "(LOWER(t.scientificName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.commonName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Taxon> findByRankAndSearch(@Param("rank") TaxonRank rank,
                                    @Param("search") String search,
                                    Pageable pageable);

    Page<Taxon> findByRank(TaxonRank rank, Pageable pageable);

    Page<Taxon> findByParentId(UUID parentId, Pageable pageable);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT COUNT(*) FROM observations o
            WHERE o.community_taxon_id IN (SELECT id FROM descendants)
            AND o.is_deleted = false
            """, nativeQuery = true)
    long countObservationsForTaxonAndDescendants(@Param("taxonId") UUID taxonId);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT id, imageUrl FROM (
                SELECT DISTINCT ON (o.id) CAST(o.id AS varchar) as id, oi.image_url as imageUrl, o.created_at
                FROM observation_images oi
                JOIN observations o ON oi.observation_id = o.id
                WHERE o.community_taxon_id IN (SELECT id FROM descendants)
                AND o.is_deleted = false
                ORDER BY o.id, o.created_at DESC
            ) sub
            ORDER BY sub.created_at DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<RecentObservationProjection> findRecentObservationImagesForTaxon(@Param("taxonId") UUID taxonId, @Param("limit") int limit);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT u.id as userId, u.username, u.display_name as displayName, u.avatar_url as avatarUrl, COUNT(o.id) as observationCount
            FROM observations o
            JOIN users u ON o.user_id = u.id
            WHERE o.community_taxon_id IN (SELECT id FROM descendants)
            AND o.is_deleted = false
            GROUP BY u.id, u.username, u.display_name, u.avatar_url
            ORDER BY COUNT(o.id) DESC, u.username
            LIMIT 1
            """, nativeQuery = true)
    Optional<TopObserverProjection> findTopObserverForTaxon(@Param("taxonId") UUID taxonId);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT u.id as userId, u.username, u.display_name as displayName, u.avatar_url as avatarUrl, COUNT(i.id) as identificationCount
            FROM identifications i
            JOIN users u ON i.user_id = u.id
            WHERE i.taxon_id IN (SELECT id FROM descendants)
            AND i.is_current = true
            AND i.is_withdrawn = false
            GROUP BY u.id, u.username, u.display_name, u.avatar_url
            ORDER BY COUNT(i.id) DESC, u.username
            LIMIT 1
            """, nativeQuery = true)
    Optional<TopIdentifierProjection> findTopIdentifierForTaxon(@Param("taxonId") UUID taxonId);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id as root_id, id as descendant_id FROM taxa WHERE id IN :taxonIds
                UNION ALL
                SELECT d.root_id, t.id FROM taxa t JOIN descendants d ON t.parent_id = d.descendant_id
            )
            SELECT d.root_id as id, COUNT(o.id) as count
            FROM descendants d
            LEFT JOIN observations o ON o.community_taxon_id = d.descendant_id AND o.is_deleted = false
            GROUP BY d.root_id
            """, nativeQuery = true)
    List<TaxonObservationCountProjection> countObservationsForTaxa(@Param("taxonIds") List<UUID> taxonIds);

    @Query(value = """
            WITH RECURSIVE descendants AS (
                SELECT id FROM taxa WHERE id = :taxonId
                UNION ALL
                SELECT t.id FROM taxa t JOIN descendants d ON t.parent_id = d.id
            )
            SELECT id FROM descendants
            """, nativeQuery = true)
    List<UUID> findDescendantIds(@Param("taxonId") UUID taxonId);
}
