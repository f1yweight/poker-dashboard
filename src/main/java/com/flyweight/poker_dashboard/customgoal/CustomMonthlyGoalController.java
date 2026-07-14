package com.flyweight.poker_dashboard.customgoal;

import com.flyweight.poker_dashboard.customgoal.dto.CreateCustomMonthlyGoalRequest;
import com.flyweight.poker_dashboard.customgoal.dto.CustomMonthlyGoalResponse;
import com.flyweight.poker_dashboard.customgoal.dto.UpdateCustomMonthlyGoalRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/custom-monthly-goals")
public class CustomMonthlyGoalController {

    private final CustomMonthlyGoalService customMonthlyGoalService;

    public CustomMonthlyGoalController(CustomMonthlyGoalService customMonthlyGoalService) {
        this.customMonthlyGoalService = customMonthlyGoalService;
    }

    @GetMapping
    public List<CustomMonthlyGoalResponse> getByMonth(@RequestParam LocalDate month) {
        return customMonthlyGoalService.getByMonth(month);
    }

    @PostMapping
    public CustomMonthlyGoalResponse create(@RequestParam LocalDate month
            , @Valid @RequestBody CreateCustomMonthlyGoalRequest request) {
        return customMonthlyGoalService.create(month, request);
    }

    @PatchMapping("/{id}")
    public CustomMonthlyGoalResponse update(@PathVariable Long id
            , @Valid @RequestBody UpdateCustomMonthlyGoalRequest request) {
        return customMonthlyGoalService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        customMonthlyGoalService.delete(id);
    }
}
