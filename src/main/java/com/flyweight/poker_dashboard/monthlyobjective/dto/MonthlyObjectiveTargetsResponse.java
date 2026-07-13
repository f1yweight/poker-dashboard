package com.flyweight.poker_dashboard.monthlyobjective.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class MonthlyObjectiveTargetsResponse {

    private Long id;

    private LocalDate targetMonth;

    private Integer mttPlayedTarget;

    private BigDecimal learningHoursTarget;

    private BigDecimal sportHoursTarget;
}
