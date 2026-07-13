package com.flyweight.poker_dashboard.monthlyobjective.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class UpdateMonthlyObjectiveTargetsRequest {

    @PositiveOrZero
    private Integer mttPlayedTarget;

    @PositiveOrZero
    private BigDecimal learningHoursTarget;

    @PositiveOrZero
    private BigDecimal sportHoursTarget;
}
