package com.flyweight.poker_dashboard.dailyentry;

import com.flyweight.poker_dashboard.dailyentry.dto.CreateDailyEntryRequest;
import com.flyweight.poker_dashboard.dailyentry.dto.DailyEntryResponse;
import com.flyweight.poker_dashboard.dailyentry.mapper.DailyEntryMapper;
import com.flyweight.poker_dashboard.user.User;
import com.flyweight.poker_dashboard.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class DailyEntryService {

    private final DailyEntryRepository dailyEntryRepository;
    private final DailyEntryMapper dailyEntryMapper;

    public DailyEntryService(DailyEntryRepository dailyEntryRepository
            , DailyEntryMapper dailyEntryMapper, UserRepository userRepository) {
        this.dailyEntryRepository = dailyEntryRepository;
        this.dailyEntryMapper = dailyEntryMapper;
    }

    private User getCurrentUser() {
        return (User) Objects.requireNonNull(SecurityContextHolder
                        .getContext()
                        .getAuthentication())
                .getPrincipal();
    }

    public DailyEntryResponse save(CreateDailyEntryRequest request) {
        User user = getCurrentUser();

        DailyEntry dailyEntry = dailyEntryRepository
                .findByUser_IdAndEntryDate(user.getId(), request.getEntryDate())
                .orElseGet(() -> {
                    DailyEntry newEntry = dailyEntryMapper.toEntity(request);
                    newEntry.setUser(user);
                    return newEntry;
                });

        dailyEntryMapper.updateEntityFromRequest(request, dailyEntry);
        DailyEntry savedEntry = dailyEntryRepository.save(dailyEntry);
        return dailyEntryMapper.toResponse(savedEntry);
    }

    public DailyEntryResponse getByDate(LocalDate entryDate) {
        User user = getCurrentUser();
        DailyEntry dailyEntry = dailyEntryRepository.findByUser_IdAndEntryDate(user.getId(), entryDate)
                .orElseThrow(() -> new RuntimeException("Daily entry not found"));
        return dailyEntryMapper.toResponse(dailyEntry);
    }

    public List<DailyEntryResponse> getByDateBetween(LocalDate startDate, LocalDate endDate) {
        User user = getCurrentUser();
        List<DailyEntry> dailyEntries = dailyEntryRepository
                .findByUser_IdAndEntryDateBetweenOrderByEntryDateAsc(user.getId(), startDate, endDate);
        return dailyEntries
                .stream()
                .map(dailyEntryMapper::toResponse)
                .toList();
    }
}
