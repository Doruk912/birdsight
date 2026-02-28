package com.birdsight.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsernameAndDeletedFalse(String username);

    Optional<User> findByIdAndDeletedFalse(UUID id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findAllByDeletedFalse(Pageable pageable);
}
