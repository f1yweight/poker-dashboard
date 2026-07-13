package com.flyweight.poker_dashboard.monthlyobjective;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface MonthlyObjectiveTargetsRepository extends JpaRepository<MonthlyObjectiveTargets, Long> {

    Optional<MonthlyObjectiveTargets> findByUser_IdAndTargetMonth(Long userId, LocalDate targetMonth);
}
