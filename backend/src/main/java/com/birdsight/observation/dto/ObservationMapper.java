package com.birdsight.observation.dto;

import com.birdsight.observation.Observation;
import com.birdsight.observation.ObservationImage;
import com.birdsight.taxonomy.dto.TaxonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ObservationMapper {

    private final TaxonMapper taxonMapper;

    public ObservationResponse toResponse(Observation obs, int identificationCount, int commentCount) {
        return ObservationResponse.builder()
                .id(obs.getId())
                .userId(obs.getUser().getId())
                .username(obs.getUser().getUsername())
                .userAvatarUrl(obs.getUser().getAvatarUrl())
                .description(obs.getDescription())
                .observedAt(obs.getObservedAt())
                .latitude(obs.getLocation().getY())
                .longitude(obs.getLocation().getX())
                .locationName(obs.getLocationName())
                .communityTaxon(obs.getCommunityTaxon() != null
                        ? taxonMapper.toResponse(obs.getCommunityTaxon())
                        : null)
                .qualityGrade(obs.getQualityGrade())
                .images(obs.getImages().stream().map(this::toImageResponse).toList())
                .identificationCount(identificationCount)
                .commentCount(commentCount)
                .createdAt(obs.getCreatedAt())
                .updatedAt(obs.getUpdatedAt())
                .build();
    }

    public ObservationImageResponse toImageResponse(ObservationImage img) {
        return ObservationImageResponse.builder()
                .id(img.getId())
                .imageUrl(img.getImageUrl())
                .position(img.getPosition())
                .createdAt(img.getCreatedAt())
                .build();
    }

    public ObservationMapResponse toMapResponse(Observation obs) {
        String thumbnail = obs.getImages().isEmpty() ? null : obs.getImages().getFirst().getImageUrl();
        return ObservationMapResponse.builder()
                .id(obs.getId())
                .latitude(obs.getLocation().getY())
                .longitude(obs.getLocation().getX())
                .speciesCommonName(obs.getCommunityTaxon() != null
                        ? obs.getCommunityTaxon().getCommonName()
                        : null)
                .speciesScientificName(obs.getCommunityTaxon() != null
                        ? obs.getCommunityTaxon().getScientificName()
                        : null)
                .qualityGrade(obs.getQualityGrade())
                .thumbnailUrl(thumbnail)
                .build();
    }
}
