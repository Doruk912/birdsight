CREATE TABLE users
(
    id                UUID                        NOT NULL,
    created_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    username          VARCHAR(50)                 NOT NULL,
    email             VARCHAR(255)                NOT NULL,
    password          VARCHAR(255)                NOT NULL,
    display_name      VARCHAR(100),
    bio               TEXT,
    role              VARCHAR(20)                 NOT NULL DEFAULT 'USER',
    is_deleted        BOOLEAN                     NOT NULL DEFAULT FALSE,
    is_suspended      BOOLEAN                     NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);