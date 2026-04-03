package com.birdsight.taxonomy;

import com.birdsight.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "taxa")
public class Taxon extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "rank", nullable = false, length = 20)
    private TaxonRank rank;

    @Column(name = "scientific_name", nullable = false, unique = true)
    private String scientificName;

    @Column(name = "common_name")
    private String commonName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Taxon parent;

    @Column(name = "cover_image_url", length = 512)
    private String coverImageUrl;
}
