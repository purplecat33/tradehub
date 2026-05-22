package com.tradehub.tradehub.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.tradehub.tradehub.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
