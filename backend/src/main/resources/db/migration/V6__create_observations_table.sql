-- Observations table with PostGIS location
CREATE TABLE observations (
    id              UUID                        NOT NULL,
    user_id         UUID                        NOT NULL,
    description     TEXT,
    observed_at     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    location        GEOMETRY(Point, 4326)       NOT NULL,
    location_name   VARCHAR(255),
    community_taxon_id UUID,
    quality_grade   VARCHAR(20)                 NOT NULL DEFAULT 'NEEDS_ID',
    is_deleted      BOOLEAN                     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_observations PRIMARY KEY (id),
    CONSTRAINT fk_observations_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_observations_community_taxon FOREIGN KEY (community_taxon_id) REFERENCES taxa(id)
);

CREATE INDEX idx_observations_user ON observations(user_id);
CREATE INDEX idx_observations_location ON observations USING GIST(location);
CREATE INDEX idx_observations_quality ON observations(quality_grade);
CREATE INDEX idx_observations_observed_at ON observations(observed_at);

-- Observation images (1-5 per observation)
CREATE TABLE observation_images (
    id              UUID                        NOT NULL,
    observation_id  UUID                        NOT NULL,
    image_url       VARCHAR(512)                NOT NULL,
    position        INT                         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_observation_images PRIMARY KEY (id),
    CONSTRAINT fk_obs_images_observation FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
);

CREATE INDEX idx_obs_images_observation ON observation_images(observation_id);
