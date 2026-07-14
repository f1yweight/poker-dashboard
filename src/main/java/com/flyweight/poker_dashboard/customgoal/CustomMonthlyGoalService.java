package com.flyweight.poker_dashboard.customgoal;

import com.flyweight.poker_dashboard.customgoal.dto.CreateCustomMonthlyGoalRequest;
import com.flyweight.poker_dashboard.customgoal.dto.CustomMonthlyGoalResponse;
import com.flyweight.poker_dashboard.customgoal.dto.UpdateCustomMonthlyGoalRequest;
import com.flyweight.poker_dashboard.customgoal.mapper.CustomMonthlyGoalMapper;
import com.flyweight.poker_dashboard.exception.ResourceNotFoundException;
import com.flyweight.poker_dashboard.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class CustomMonthlyGoalService {

    private final CustomMonthlyGoalRepository customMonthlyGoalRepository;
    private final CustomMonthlyGoalMapper customMonthlyGoalMapper;

    public CustomMonthlyGoalService(CustomMonthlyGoalRepository customMonthlyGoalRepository
            , CustomMonthlyGoalMapper customMonthlyGoalMapper) {
        this.customMonthlyGoalRepository = customMonthlyGoalRepository;
        this.customMonthlyGoalMapper = customMonthlyGoalMapper;
    }

    private User getCurrentUser() {
        return (User) Objects.requireNonNull(SecurityContextHolder
                        .getContext()
                        .getAuthentication())
                .getPrincipal();
    }

    private LocalDate normalizeMonth(LocalDate targetMonth) {
        return targetMonth.withDayOfMonth(1);
    }

    public List<CustomMonthlyGoalResponse> getByMonth(LocalDate targetMonth) {
        User user = getCurrentUser();
        LocalDate normalizedTargetMonth = normalizeMonth(targetMonth);

        return customMonthlyGoalRepository
                .findByUser_IdAndTargetMonthOrderByCreatedAtAsc(user.getId(), normalizedTargetMonth)
                .stream()
                .map(customMonthlyGoalMapper::toResponse)
                .toList();
    }

    public CustomMonthlyGoalResponse create(LocalDate targetMonth
            , CreateCustomMonthlyGoalRequest request) {
        User user = getCurrentUser();
        LocalDate normalizedTargetMonth = normalizeMonth(targetMonth);

        CustomMonthlyGoal customMonthlyGoal = customMonthlyGoalMapper.toEntity(request);
        customMonthlyGoal.setUser(user);
        customMonthlyGoal.setTargetMonth(normalizedTargetMonth);

        CustomMonthlyGoal savedGoal = customMonthlyGoalRepository.save(customMonthlyGoal);
        return customMonthlyGoalMapper.toResponse(savedGoal);
    }

    public CustomMonthlyGoalResponse update(Long id, UpdateCustomMonthlyGoalRequest request) {
        User user = getCurrentUser();

        CustomMonthlyGoal customMonthlyGoal = customMonthlyGoalRepository
                .findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Custom monthly goal not found"));

        customMonthlyGoalMapper.updateEntityFromRequest(request, customMonthlyGoal);

        CustomMonthlyGoal savedGoal = customMonthlyGoalRepository.save(customMonthlyGoal);
        return customMonthlyGoalMapper.toResponse(savedGoal);
    }

    public void delete(Long id) {
        User user = getCurrentUser();

        CustomMonthlyGoal customMonthlyGoal = customMonthlyGoalRepository
                .findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Custom monthly goal not found"));

        customMonthlyGoalRepository.delete(customMonthlyGoal);
    }
}
