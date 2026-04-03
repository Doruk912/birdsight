-- Add new column to taxa table for taxon detail pages
ALTER TABLE taxa ADD COLUMN cover_image_url VARCHAR(512);

-- Insert Class Aves as the root taxon
INSERT INTO taxa (id, rank, scientific_name, common_name, parent_id, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'CLASS', 'Aves', 'Birds', NULL, now(), now());

-- Re-parent all existing orders under Class Aves
UPDATE taxa SET parent_id = '00000000-0000-0000-0000-000000000001' WHERE rank = 'ORDER';
