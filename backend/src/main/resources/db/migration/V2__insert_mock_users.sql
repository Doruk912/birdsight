-- Password hashing will be implemented later

INSERT INTO users (id, created_at, updated_at, username, email, password, display_name, bio, role, is_deleted, is_suspended, email_verified_at)
VALUES
('11111111-1111-1111-1111-111111111111', now(), now(), 'alice', 'alice@example.com', 'password123', 'Alice', NULL, 'USER', FALSE, FALSE, NULL),
('22222222-2222-2222-2222-222222222222', now(), now(), 'bob', 'bob@example.com', 'bobpassword', 'Bob', NULL, 'USER', FALSE, FALSE, NULL),
('33333333-3333-3333-3333-333333333333', now(), now(), 'carol', 'carol@example.com', 'carolpass', 'Carol', NULL, 'USER', FALSE, FALSE, NULL),
('44444444-4444-4444-4444-444444444444', now(), now(), 'john', 'john.curator@example.com', 'curatorpass', 'John', NULL, 'CURATOR', FALSE, FALSE, NULL),
('55555555-5555-5555-5555-555555555555', now(), now(), 'admin', 'admin@example.com', 'adminpass', 'Admin', NULL, 'ADMIN', FALSE, FALSE, NULL);
