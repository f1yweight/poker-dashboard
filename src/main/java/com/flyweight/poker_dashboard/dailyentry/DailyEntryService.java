package com.flyweight.poker_dashboard.dailyentry;

import com.flyweight.poker_dashboard.dailyentry.dto.CreateDailyEntryRequest;
import com.flyweight.poker_dashboard.dailyentry.dto.DailyEntryResponse;
import com.flyweight.poker_dashboard.dailyentry.mapper.DailyEntryMapper;
import com.flyweight.poker_dashboard.user.User;
import com.flyweight.poker_dashboard.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyEntryService {

    private final DailyEntryRepository dailyEntryRepository;
    private final DailyEntryMapper dailyEntryMapper;
    private final UserRepository userRepository;

    private static final Long TEMP_USER_ID = 1L;

    public DailyEntryService(DailyEntryRepository dailyEntryRepository
            , DailyEntryMapper dailyEntryMapper, UserRepository userRepository) {
        this.dailyEntryRepository = dailyEntryRepository;
        this.dailyEntryMapper = dailyEntryMapper;
        this.userRepository = userRepository;
    }

    public DailyEntryResponse save(CreateDailyEntryRequest request) {
        User user = userRepository
                .findById(TEMP_USER_ID)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DailyEntry dailyEntry = dailyEntryRepository
                .findByUser_IdAndEntryDate(TEMP_USER_ID, request.getEntryDate())
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
        DailyEntry dailyEntry = dailyEntryRepository.findByUser_IdAndEntryDate(TEMP_USER_ID, entryDate)
                .orElseThrow(() -> new RuntimeException("Daily entry not found"));
        return dailyEntryMapper.toResponse(dailyEntry);
    }

    public List<DailyEntryResponse> getByDateBetween(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> dailyEntries = dailyEntryRepository
                .findByUser_IdAndEntryDateBetweenOrderByEntryDateAsc(TEMP_USER_ID, startDate, endDate);
        return dailyEntries
                .stream()
                .map(dailyEntryMapper::toResponse)
                .toList();
    }
}
