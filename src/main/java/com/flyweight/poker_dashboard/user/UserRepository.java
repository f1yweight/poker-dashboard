package com.flyweight.poker_dashboard.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String userName);

    boolean existsByEmail(String email);
}
