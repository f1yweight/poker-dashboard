package com.flyweight.poker_dashboard.monthlyobjective;

import com.flyweight.poker_dashboard.monthlyobjective.dto.MonthlyObjectiveTargetsResponse;
import com.flyweight.poker_dashboard.monthlyobjective.dto.UpdateMonthlyObjectiveTargetsRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/monthly-objective-targets")
public class MonthlyObjectiveTargetsController {

    private final MonthlyObjectiveTargetsService monthlyObjectiveTargetsService;

    public MonthlyObjectiveTargetsController(MonthlyObjectiveTargetsService monthlyObjectiveTargetsService) {
        this.monthlyObjectiveTargetsService = monthlyObjectiveTargetsService;
    }

    @GetMapping
    public MonthlyObjectiveTargetsResponse getOrCreate(@RequestParam LocalDate month) {
        return monthlyObjectiveTargetsService.getOrCreate(month);
    }

    @PutMapping
    public MonthlyObjectiveTargetsResponse update(@RequestParam LocalDate month
            , @Valid @RequestBody UpdateMonthlyObjectiveTargetsRequest request) {
        return monthlyObjectiveTargetsService.update(month, request);
    }
}
