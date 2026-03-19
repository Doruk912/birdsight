-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Taxonomy table for bird classification hierarchy
-- Supports: ORDER -> FAMILY -> GENUS -> SPECIES
CREATE TABLE taxa (
    id              UUID                        NOT NULL,
    rank            VARCHAR(20)                 NOT NULL,
    scientific_name VARCHAR(255)                NOT NULL,
    common_name     VARCHAR(255),
    parent_id       UUID,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_taxa PRIMARY KEY (id),
    CONSTRAINT uc_taxa_scientific_name UNIQUE (scientific_name),
    CONSTRAINT fk_taxa_parent FOREIGN KEY (parent_id) REFERENCES taxa(id)
);

CREATE INDEX idx_taxa_parent ON taxa(parent_id);
CREATE INDEX idx_taxa_rank ON taxa(rank);
CREATE INDEX idx_taxa_common_name ON taxa(common_name);
