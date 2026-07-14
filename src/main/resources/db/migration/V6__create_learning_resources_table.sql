CREATE TABLE learning_resources
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    title       VARCHAR(255) NOT NULL,
    url         TEXT         NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    status      VARCHAR(30)  NOT NULL DEFAULT 'TO_WATCH',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_learning_resources_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_learning_resources_title_not_blank
        CHECK (length(trim(title)) > 0),

    CONSTRAINT chk_learning_resources_url_not_blank
        CHECK (length(trim(url)) > 0),

    CONSTRAINT chk_learning_resources_status
        CHECK (status IN ('TO_WATCH', 'IN_PROGRESS', 'DONE'))
);

CREATE INDEX idx_learning_resources_user_id
    ON learning_resources (user_id);

CREATE INDEX idx_learning_resources_user_status
    ON learning_resources (user_id, status);

CREATE INDEX idx_learning_resources_user_created_at
    ON learning_resources (user_id, created_at);