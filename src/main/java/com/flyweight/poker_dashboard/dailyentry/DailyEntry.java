package com.flyweight.poker_dashboard.dailyentry;

import com.flyweight.poker_dashboard.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_entries")
@Getter
@Setter
@NoArgsConstructor
public class DailyEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "mtt_hours")
    private BigDecimal mttHours;

    @Column(name = "mtt_amount")
    private Integer mttPlayed;

    @Column(name = "hands_amount")
    private Integer handsPlayed;

    @Column(name = "ev_bb_100")
    private BigDecimal evBb100;

    @Column(name = "profit")
    private BigDecimal profit;

    @Column(name = "abi")
    private BigDecimal abi;

    @Column(name = "learning_hours")
    private BigDecimal learningHours;

    @Column(name = "sport_hours")
    private BigDecimal sportHours;

    @Column(name = "comment")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
