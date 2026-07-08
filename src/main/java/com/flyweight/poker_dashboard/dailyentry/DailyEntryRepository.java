package com.flyweight.poker_dashboard.dailyentry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyEntryRepository extends JpaRepository<DailyEntry, Long> {

    Optional<DailyEntry> findByUser_IdAndEntryDate(Long userId, LocalDate entryDate);

    List<DailyEntry> findAllByUser_IdOrderByEntryDateDesc(Long userId);
}
