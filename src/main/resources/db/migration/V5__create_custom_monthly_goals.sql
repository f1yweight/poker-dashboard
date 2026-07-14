CREATE TABLE custom_monthly_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_month DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_custom_monthly_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT chk_custom_monthly_goals_title_not_blank
        CHECK (length(trim(title)) > 0)
);

CREATE INDEX idx_custom_monthly_goals_user_month
    ON custom_monthly_goals (user_id, target_month);