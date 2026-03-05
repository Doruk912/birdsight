-- Passwords are BCrypt hashed (strength 12)
-- All mock users share the same password: password

UPDATE users
SET password = '$2a$12$LKwHvmHzm1j0HHe73Ot9LOWm9Dcy38ZNISNJP03T5cTUa8mw8uHe6';