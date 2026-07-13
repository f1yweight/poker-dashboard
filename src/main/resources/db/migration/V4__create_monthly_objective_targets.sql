CREATE TABLE monthly_objective_targets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_month DATE NOT NULL,

    mtt_played_target INTEGER NOT NULL DEFAULT 400,
    learning_hours_target NUMERIC(5, 2) NOT NULL DEFAULT 10,
    sport_hours_target NUMERIC(5, 2) NOT NULL DEFAULT 5,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_monthly_objective_targets_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_monthly_objective_targets_user_month
        UNIQUE (user_id, target_month),

    CONSTRAINT chk_monthly_objective_targets_mtt_played_non_negative
        CHECK (mtt_played_target >= 0),

    CONSTRAINT chk_monthly_objective_targets_learning_hours_non_negative
        CHECK (learning_hours_target >= 0),

    CONSTRAINT chk_monthly_objective_targets_sport_hours_non_negative
        CHECK (sport_hours_target >= 0)
);