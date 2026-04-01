package com.birdsight.taxonomy;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaxonRepository extends JpaRepository<Taxon, UUID> {

    @Query("SELECT t FROM Taxon t WHERE " +
           "LOWER(t.scientificName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.commonName) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Taxon> searchByName(@Param("query") String query, Pageable pageable);

    List<Taxon> findByParentId(UUID parentId);

    List<Taxon> findByScientificNameIn(List<String> scientificNames);
}
