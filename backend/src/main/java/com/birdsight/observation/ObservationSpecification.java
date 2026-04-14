package com.birdsight.observation;

import com.birdsight.observation.dto.ObservationFilterRequest;
import com.birdsight.taxonomy.Taxon;
import jakarta.persistence.criteria.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ObservationSpecification {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    public static Specification<Observation> withFilters(ObservationFilterRequest filter, List<UUID> descendantTaxonIds) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude deleted observations
            predicates.add(cb.isFalse(root.get("deleted")));

            // Free-text search on taxon common/scientific name
            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                Join<Observation, Taxon> taxonJoin = root.join("communityTaxon", JoinType.LEFT);
                Predicate commonNameMatch = cb.like(cb.lower(taxonJoin.get("commonName")), pattern);
                Predicate scientificNameMatch = cb.like(cb.lower(taxonJoin.get("scientificName")), pattern);
                predicates.add(cb.or(commonNameMatch, scientificNameMatch));
            }

            // Quality grade
            if (filter.getGrade() != null) {
                predicates.add(cb.equal(root.get("qualityGrade"), filter.getGrade()));
            }

            // Taxon filter (including all descendants)
            if (descendantTaxonIds != null && !descendantTaxonIds.isEmpty()) {
                predicates.add(root.get("communityTaxon").get("id").in(descendantTaxonIds));
            }

            // Observer filter
            if (filter.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), filter.getUserId()));
            }

            // Date range
            if (filter.getDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("observedAt"), filter.getDateFrom()));
            }
            if (filter.getDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("observedAt"), filter.getDateTo()));
            }

            // Geographic bounding box using native PostGIS function
            if (filter.hasBoundingBox()) {
                Coordinate[] coords = new Coordinate[]{
                        new Coordinate(filter.getSwLng(), filter.getSwLat()),
                        new Coordinate(filter.getNeLng(), filter.getSwLat()),
                        new Coordinate(filter.getNeLng(), filter.getNeLat()),
                        new Coordinate(filter.getSwLng(), filter.getNeLat()),
                        new Coordinate(filter.getSwLng(), filter.getSwLat())
                };
                Polygon envelope = GEOMETRY_FACTORY.createPolygon(coords);

                predicates.add(cb.isTrue(
                        cb.function("ST_Within", Boolean.class,
                                root.get("location"),
                                cb.literal(envelope))
                ));
            }

            // Order by createdAt DESC
            query.orderBy(cb.desc(root.get("createdAt")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
