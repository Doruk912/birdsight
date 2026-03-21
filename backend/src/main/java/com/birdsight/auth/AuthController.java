package com.birdsight.auth;

import com.birdsight.auth.dto.AuthResponse;
import com.birdsight.auth.dto.LoginRequest;
import com.birdsight.auth.dto.RegisterRequest;
import com.birdsight.security.JwtProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.birdsight.security.CustomUserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProperties jwtProperties;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                  HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        String refreshToken = authService.generateRefreshToken(authResponse.getUser().getEmail());
        setRefreshTokenCookie(response, refreshToken);
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        String refreshToken = authService.generateRefreshToken(authResponse.getUser().getEmail());
        setRefreshTokenCookie(response, refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request,
                                                 HttpServletResponse response) {
        String refreshToken = extractRefreshTokenCookie(request);
        AuthResponse authResponse = authService.refresh(refreshToken);
        String newRefreshToken = authService.generateRefreshToken(authResponse.getUser().getEmail());
        setRefreshTokenCookie(response, newRefreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        clearRefreshTokenCookie(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal CustomUserDetails principal,
                                            HttpServletRequest request) {
        String refreshToken = extractRefreshTokenCookie(request);
        AuthResponse authResponse = authService.refresh(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    // ---- cookie helpers ----

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(jwtProperties.getRefreshCookieName(), token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);          // HTTPS only
        cookie.setPath("/api/auth");     // scoped: only sent to auth endpoints
        cookie.setMaxAge((int) (jwtProperties.getRefreshTokenExpiration() / 1000));
        // SameSite=Strict via header (Cookie API doesn't expose it directly pre-Servlet 6)
        response.addCookie(cookie);
        response.addHeader("Set-Cookie",
                String.format("%s=%s; Path=/api/auth; Max-Age=%d; HttpOnly; Secure; SameSite=Strict",
                        jwtProperties.getRefreshCookieName(), token,
                        (int) (jwtProperties.getRefreshTokenExpiration() / 1000)));
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(jwtProperties.getRefreshCookieName(), "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        response.addHeader("Set-Cookie",
                String.format("%s=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
                        jwtProperties.getRefreshCookieName()));
    }

    private String extractRefreshTokenCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> jwtProperties.getRefreshCookieName().equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
