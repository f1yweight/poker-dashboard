package com.flyweight.poker_dashboard.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String userName);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
