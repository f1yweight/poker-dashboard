package com.flyweight.poker_dashboard.customgoal.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class CustomMonthlyGoalResponse {

    private Long id;

    private LocalDate targetMonth;

    private String title;

    private Boolean completed;
}
