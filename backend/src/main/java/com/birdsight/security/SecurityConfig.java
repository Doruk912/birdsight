package com.birdsight.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final AuthEntryPoint authEntryPoint;
    private final AuthAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // Taxonomy — public read, curator/admin write
                        .requestMatchers(HttpMethod.GET, "/api/v1/taxa/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/taxa/**").hasAnyRole("CURATOR", "ADMIN")
                        // Observations — public read, authenticated write
                        .requestMatchers(HttpMethod.GET, "/api/v1/observations/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/observations").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/observations/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/observations/**").authenticated()
                        // Identifications — public read (via GET observations), authenticated write
                        .requestMatchers(HttpMethod.POST, "/api/v1/observations/*/identifications").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/observations/*/identifications/*").authenticated()
                        // Comments — public read, authenticated write
                        .requestMatchers(HttpMethod.POST, "/api/v1/observations/*/comments").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/observations/*/comments/*").authenticated()
                        // Current user self-service endpoints — authenticated users only
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/me/password").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/users/me/avatar").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/me/avatar").authenticated()
                        // User search — public (for filter autocomplete)
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/search").permitAll()
                        // Public user profile access
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/username/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/{id}").permitAll()
                        // User management — admin only for write operations
                        .requestMatchers(HttpMethod.GET, "/api/v1/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/**").authenticated()
                        // ML Prediction — authenticated users only
                        .requestMatchers(HttpMethod.POST, "/api/v1/ml/predict").authenticated()
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
