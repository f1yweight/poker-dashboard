package com.flyweight.poker_dashboard.dailyentry.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class DailyEntryResponse {

    private Long id;

    private LocalDate entryDate;

    private BigDecimal mttHours;

    private Integer mttPlayed;

    private Integer handsPlayed;

    private BigDecimal evBb100;

    private BigDecimal profit;

    private BigDecimal abi;

    private BigDecimal learningHours;

    private BigDecimal sportHours;

    private String comment;
}
