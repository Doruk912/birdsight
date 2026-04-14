package com.birdsight.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsernameAndDeletedFalse(String username);

    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByIdAndDeletedFalse(UUID id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findAllByDeletedFalse(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.deleted = false AND (u.email = :identifier OR u.username = :identifier)")
    Optional<User> findByEmailOrUsernameAndDeletedFalse(@Param("identifier") String identifier);

    @Query("SELECT u FROM User u WHERE u.deleted = false AND " +
           "(LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.displayName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<User> searchByNameOrUsername(@Param("query") String query, Pageable pageable);
}
