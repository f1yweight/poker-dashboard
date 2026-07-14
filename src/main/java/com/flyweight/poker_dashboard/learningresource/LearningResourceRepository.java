package com.flyweight.poker_dashboard.learningresource;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {

    List<LearningResource> findByUser_IdOrderByCreatedAtDesc(Long userId);

    List<LearningResource> findByUser_IdAndStatusOrderByCreatedAtDesc(Long userId
            , LearningResourceStatus status);

    Optional<LearningResource> findByIdAndUser_Id(Long id, Long userId);
}
