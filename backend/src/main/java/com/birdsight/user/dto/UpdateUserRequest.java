package com.birdsight.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_.-]+$", message = "Username may only contain letters, numbers, underscores, dots and hyphens")
    private String username;

    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 50, message = "Display name must be at most 50 characters")
    private String displayName;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;
}


