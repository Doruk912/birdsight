package com.birdsight.observation;

import com.birdsight.observation.dto.CreateObservationRequest;
import com.birdsight.observation.dto.ObservationMapResponse;
import com.birdsight.observation.dto.ObservationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/observations")
@RequiredArgsConstructor
public class ObservationController {

    private final ObservationService observationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ObservationResponse> createObservation(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestPart("observation") CreateObservationRequest request,
            @RequestPart("images") List<MultipartFile> images) {

        ObservationResponse created = observationService.createObservation(
                principal.getUsername(), request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<Page<ObservationResponse>> getAllObservations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) QualityGrade grade,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(observationService.getAllObservations(search, grade, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ObservationResponse>> getObservationsByUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(observationService.getObservationsByUser(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObservationResponse> getObservationById(@PathVariable UUID id) {
        return ResponseEntity.ok(observationService.getObservationById(id));
    }

    @GetMapping("/map")
    public ResponseEntity<List<ObservationMapResponse>> getMapObservations() {
        return ResponseEntity.ok(observationService.getMapObservations());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteObservation(@PathVariable UUID id,
                                                    @AuthenticationPrincipal UserDetails principal) {
        observationService.deleteObservation(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
