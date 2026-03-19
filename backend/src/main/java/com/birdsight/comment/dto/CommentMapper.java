package com.birdsight.comment.dto;

import com.birdsight.comment.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .observationId(comment.getObservation().getId())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .userAvatarUrl(comment.getUser().getAvatarUrl())
                .body(comment.getBody())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
