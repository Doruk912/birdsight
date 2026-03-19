package com.birdsight.comment;

import com.birdsight.comment.dto.CommentMapper;
import com.birdsight.comment.dto.CommentResponse;
import com.birdsight.comment.dto.CreateCommentRequest;
import com.birdsight.common.exception.BadRequestException;
import com.birdsight.common.exception.ResourceNotFoundException;
import com.birdsight.observation.Observation;
import com.birdsight.observation.ObservationRepository;
import com.birdsight.user.User;
import com.birdsight.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final ObservationRepository observationRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse addComment(UUID observationId, String userEmail, CreateCommentRequest request) {
        Observation observation = observationRepository.findByIdAndDeletedFalse(observationId)
                .orElseThrow(() -> new ResourceNotFoundException("Observation", "id", observationId));

        User user = userRepository.findByEmailAndDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Comment comment = Comment.builder()
                .observation(observation)
                .user(user)
                .body(request.getBody())
                .build();

        Comment saved = commentRepository.saveAndFlush(comment);
        return commentMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(UUID observationId) {
        return commentRepository.findActiveByObservationId(observationId).stream()
                .map(commentMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deleteComment(UUID observationId, UUID commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only delete your own comments.");
        }
        if (!comment.getObservation().getId().equals(observationId)) {
            throw new BadRequestException("Comment does not belong to this observation.");
        }

        comment.setDeleted(true);
        commentRepository.saveAndFlush(comment);
    }
}
