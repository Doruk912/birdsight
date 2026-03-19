-- Identifications: users can identify species on observations
CREATE TABLE identifications (
    id              UUID                        NOT NULL,
    observation_id  UUID                        NOT NULL,
    user_id         UUID                        NOT NULL,
    taxon_id        UUID                        NOT NULL,
    comment         TEXT,
    is_current      BOOLEAN                     NOT NULL DEFAULT TRUE,
    is_withdrawn    BOOLEAN                     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_identifications PRIMARY KEY (id),
    CONSTRAINT fk_identifications_observation FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
    CONSTRAINT fk_identifications_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_identifications_taxon FOREIGN KEY (taxon_id) REFERENCES taxa(id)
);

CREATE INDEX idx_identifications_observation ON identifications(observation_id);
CREATE INDEX idx_identifications_user ON identifications(user_id);
