CREATE TABLE daily_entries (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,

    mtt_hours NUMERIC(4, 2),
    mtt_amount INTEGER,
    hands_amount INTEGER,
    ev_bb_100 NUMERIC(6, 2),
    profit NUMERIC(10, 2),
    abi NUMERIC(8, 2),

    learning_hours NUMERIC(4, 2),
    sport_hours NUMERIC(4, 2),

    comment TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_daily_entries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT uq_daily_entries_user_date
        UNIQUE (user_id, entry_date)
);