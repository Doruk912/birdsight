package com.birdsight.identification.dto;

import com.birdsight.identification.Identification;
import org.springframework.stereotype.Component;

@Component
public class IdentificationMapper {

    public IdentificationResponse toResponse(Identification id) {
        return IdentificationResponse.builder()
                .id(id.getId())
                .observationId(id.getObservation().getId())
                .userId(id.getUser().getId())
                .username(id.getUser().getUsername())
                .userAvatarUrl(id.getUser().getAvatarUrl())
                .taxonId(id.getTaxon().getId())
                .taxonScientificName(id.getTaxon().getScientificName())
                .taxonCommonName(id.getTaxon().getCommonName())
                .taxonRank(id.getTaxon().getRank())
                .comment(id.getComment())
                .current(id.isCurrent())
                .withdrawn(id.isWithdrawn())
                .createdAt(id.getCreatedAt())
                .build();
    }
}
