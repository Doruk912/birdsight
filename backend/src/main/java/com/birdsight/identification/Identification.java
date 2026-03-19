package com.birdsight.identification;

import com.birdsight.common.BaseEntity;
import com.birdsight.observation.Observation;
import com.birdsight.taxonomy.Taxon;
import com.birdsight.user.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "identifications")
public class Identification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "observation_id", nullable = false)
    private Observation observation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taxon_id", nullable = false)
    private Taxon taxon;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private boolean current = true;

    @Column(name = "is_withdrawn", nullable = false)
    @Builder.Default
    private boolean withdrawn = false;
}
