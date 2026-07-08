package com.flyweight.poker_dashboard.dailyentry;

import com.flyweight.poker_dashboard.dailyentry.dto.CreateDailyEntryRequest;
import com.flyweight.poker_dashboard.dailyentry.dto.DailyEntryResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @GetMapping(params = "date")
    public DailyEntryResponse getByDate(@RequestParam LocalDate date) {
        return dailyEntryService.getByDate(date);
    }

    @GetMapping(params = {"startDate", "endDate"})
    public List<DailyEntryResponse> getByDateBetween(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return dailyEntryService.getByDateBetween(startDate, endDate);
    }
}
