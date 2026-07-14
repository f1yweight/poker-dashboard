package com.flyweight.poker_dashboard.customgoal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CustomMonthlyGoalRepository extends JpaRepository<CustomMonthlyGoal, Long> {

    List<CustomMonthlyGoal> findByUser_IdAndTargetMonthOrderByCreatedAtAsc(Long userId, LocalDate targetMonth);

    Optional<CustomMonthlyGoal> findByIdAndUser_Id(Long id, Long userId);
}
