-- Comments: users can leave comments on observations
CREATE TABLE comments (
    id              UUID                        NOT NULL,
    observation_id  UUID                        NOT NULL,
    user_id         UUID                        NOT NULL,
    body            TEXT                        NOT NULL,
    is_deleted      BOOLEAN                     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_comments PRIMARY KEY (id),
    CONSTRAINT fk_comments_observation FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_comments_observation ON comments(observation_id);
