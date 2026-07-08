package com.flyweight.poker_dashboard.dailyentry.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class CreateDailyEntryRequest {

    @NotNull
    private LocalDate entryDate;

    @PositiveOrZero
    private BigDecimal mttHours;

    @PositiveOrZero
    private Integer mttPlayed;

    @PositiveOrZero
    private Integer handsPlayed;

    private BigDecimal evBb100;

    private BigDecimal profit;

    @PositiveOrZero
    private BigDecimal abi;

    @PositiveOrZero
    private BigDecimal learningHours;

    @PositiveOrZero
    private BigDecimal sportHours;

    private String comment;
}
