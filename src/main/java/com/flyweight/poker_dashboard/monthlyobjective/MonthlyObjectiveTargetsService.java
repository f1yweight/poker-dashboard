package com.flyweight.poker_dashboard.monthlyobjective;

import com.flyweight.poker_dashboard.monthlyobjective.dto.MonthlyObjectiveTargetsResponse;
import com.flyweight.poker_dashboard.monthlyobjective.dto.UpdateMonthlyObjectiveTargetsRequest;
import com.flyweight.poker_dashboard.monthlyobjective.mapper.MonthlyObjectiveTargetsMapper;
import com.flyweight.poker_dashboard.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Service
public class MonthlyObjectiveTargetsService {

    private static final int DEFAULT_MTT_PLAYED_TARGET = 400;
    private static final BigDecimal DEFAULT_LEARNING_HOURS_TARGET = BigDecimal.TEN;
    private static final BigDecimal DEFAULT_SPORT_HOURS_TARGET = BigDecimal.valueOf(5);

    private final MonthlyObjectiveTargetsRepository monthlyObjectiveTargetsRepository;
    private final MonthlyObjectiveTargetsMapper monthlyObjectiveTargetsMapper;

    public MonthlyObjectiveTargetsService(MonthlyObjectiveTargetsRepository monthlyObjectiveTargetsRepository
            , MonthlyObjectiveTargetsMapper monthlyObjectiveTargetsMapper) {
        this.monthlyObjectiveTargetsRepository = monthlyObjectiveTargetsRepository;
        this.monthlyObjectiveTargetsMapper = monthlyObjectiveTargetsMapper;
    }

    private User getCurrentUser() {
        return (User) Objects.requireNonNull(SecurityContextHolder
                        .getContext()
                        .getAuthentication())
                .getPrincipal();
    }

    public MonthlyObjectiveTargetsResponse getOrCreate(LocalDate targetMonth) {
        User user = getCurrentUser();
        LocalDate normalizedTargetMonth = normalizeMonth(targetMonth);

        MonthlyObjectiveTargets targets = monthlyObjectiveTargetsRepository
                .findByUser_IdAndTargetMonth(user.getId(), normalizedTargetMonth)
                .orElseGet(() -> createDefaultTargets(user, normalizedTargetMonth));

        return monthlyObjectiveTargetsMapper.toResponse(targets);
    }

    public MonthlyObjectiveTargetsResponse update(LocalDate targetMonth
            , UpdateMonthlyObjectiveTargetsRequest request) {
        User user = getCurrentUser();
        LocalDate normalizedTargetMonth = normalizeMonth(targetMonth);

        MonthlyObjectiveTargets targets = monthlyObjectiveTargetsRepository
                .findByUser_IdAndTargetMonth(user.getId(), normalizedTargetMonth)
                .orElseGet(() -> createDefaultTargets(user, normalizedTargetMonth));

        monthlyObjectiveTargetsMapper.updateEntityFromRequest(request, targets);

        MonthlyObjectiveTargets savedTargets = monthlyObjectiveTargetsRepository.save(targets);
        return monthlyObjectiveTargetsMapper.toResponse(savedTargets);
    }

    private MonthlyObjectiveTargets createDefaultTargets(User user, LocalDate targetMonth) {
        MonthlyObjectiveTargets targets = new MonthlyObjectiveTargets();

        targets.setUser(user);
        targets.setTargetMonth(targetMonth);
        targets.setMttPlayedTarget(DEFAULT_MTT_PLAYED_TARGET);
        targets.setLearningHoursTarget(DEFAULT_LEARNING_HOURS_TARGET);
        targets.setSportHoursTarget(DEFAULT_SPORT_HOURS_TARGET);

        return monthlyObjectiveTargetsRepository.save(targets);
    }

    private LocalDate normalizeMonth(LocalDate targetMonth) {
        return targetMonth.withDayOfMonth(1);
    }
}
