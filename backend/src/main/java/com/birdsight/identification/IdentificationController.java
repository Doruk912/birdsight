package com.birdsight.identification;

import com.birdsight.identification.dto.CreateIdentificationRequest;
import com.birdsight.identification.dto.IdentificationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.birdsight.security.CustomUserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/observations/{obsId}/identifications")
@RequiredArgsConstructor
public class IdentificationController {

    private final IdentificationService identificationService;

    @PostMapping
    public ResponseEntity<IdentificationResponse> addIdentification(
            @PathVariable UUID obsId,
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CreateIdentificationRequest request) {

        IdentificationResponse response = identificationService
                .addIdentification(obsId, principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<IdentificationResponse>> getIdentifications(@PathVariable UUID obsId) {
        return ResponseEntity.ok(identificationService.getIdentifications(obsId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdrawIdentification(
            @PathVariable UUID obsId,
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails principal) {

        identificationService.withdrawIdentification(obsId, id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
