package com.flyweight.poker_dashboard.customgoal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateCustomMonthlyGoalRequest {

    @NotBlank
    private String title;
}
