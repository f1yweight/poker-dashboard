package com.flyweight.poker_dashboard.monthlyobjective;

import com.flyweight.poker_dashboard.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "monthly_objective_targets",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_monthly_objective_targets_user_month",
                        columnNames = {"user_id", "target_month"}
                )
        }
)
public class MonthlyObjectiveTargets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_month", nullable = false)
    private LocalDate targetMonth;

    @Column(name = "mtt_played_target", nullable = false)
    private Integer mttPlayedTarget = 400;

    @Column(name = "learning_hours_target", nullable = false, precision = 5, scale = 2)
    private BigDecimal learningHoursTarget = BigDecimal.TEN;

    @Column(name = "sport_hours_target", nullable = false, precision = 5, scale = 2)
    private BigDecimal sportHoursTarget = BigDecimal.valueOf(5);

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
