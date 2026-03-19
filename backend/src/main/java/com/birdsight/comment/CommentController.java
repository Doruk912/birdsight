package com.birdsight.comment;

import com.birdsight.comment.dto.CommentResponse;
import com.birdsight.comment.dto.CreateCommentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/observations/{obsId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID obsId,
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.addComment(obsId, principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable UUID obsId) {
        return ResponseEntity.ok(commentService.getComments(obsId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID obsId,
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {

        commentService.deleteComment(obsId, id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
