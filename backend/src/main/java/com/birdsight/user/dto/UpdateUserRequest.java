package com.birdsight.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 100, message = "Display name must be at most 100 characters")
    private String displayName;

    private String bio;
}


