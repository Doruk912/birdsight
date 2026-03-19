package com.birdsight.observation;

import com.birdsight.common.BaseEntity;
import com.birdsight.taxonomy.Taxon;
import com.birdsight.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "observations")
public class Observation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "observed_at", nullable = false)
    private Instant observedAt;

    @Column(name = "location", nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Column(name = "location_name")
    private String locationName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_taxon_id")
    private Taxon communityTaxon;

    @Enumerated(EnumType.STRING)
    @Column(name = "quality_grade", nullable = false, length = 20)
    @Builder.Default
    private QualityGrade qualityGrade = QualityGrade.NEEDS_ID;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @OneToMany(mappedBy = "observation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    @Builder.Default
    private List<ObservationImage> images = new ArrayList<>();
}
