package com.flyweight.poker_dashboard.dailyentry;

import com.flyweight.poker_dashboard.dailyentry.dto.CreateDailyEntryRequest;
import com.flyweight.poker_dashboard.dailyentry.dto.DailyEntryResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily-entries")
public class DailyEntryController {

    private final DailyEntryService dailyEntryService;

    public DailyEntryController(DailyEntryService dailyEntryService) {
        this.dailyEntryService = dailyEntryService;
    }

    @PostMapping
    public DailyEntryResponse save(@Valid @RequestBody CreateDailyEntryRequest request) {
        return dailyEntryService.save(request);
    }
}
