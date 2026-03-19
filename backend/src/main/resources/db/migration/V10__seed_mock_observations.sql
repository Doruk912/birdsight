-- Mock observations from existing users (alice, bob, carol)
-- Locations around Istanbul and Europe for realism

-- Observation 1: Alice spots a Yellow-legged Gull at the Istanbul Bosphorus
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
        'Large gull perched on the Bosphorus seawall. Yellow legs clearly visible.',
        '2026-03-10 09:30:00', ST_SetSRID(ST_MakePoint(29.0335, 41.0082), 4326),
        'Bosphorus, Istanbul', 'd0000001-0000-0000-0000-000000000001', 'RESEARCH_GRADE', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'https://placehold.co/800x600/e2e8f0/475569?text=Yellow-legged+Gull', 0, now());

-- Identification by alice (observer) and bob → consensus = Research Grade
INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'd0000001-0000-0000-0000-000000000001', 'Classic yellow legs and red spot on bill', TRUE, FALSE, now(), now()),
('10000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'd0000001-0000-0000-0000-000000000001', 'Agree — Larus michahellis', TRUE, FALSE, now(), now());

-- Comment on obs 1
INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at) VALUES
('20000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Great photo! I see these all the time along the coast.', FALSE, now(), now());


-- Observation 2: Bob spots a Hooded Crow in Kadikoy
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
        'Hooded crow foraging in the park. Very bold, came close.',
        '2026-03-11 14:00:00', ST_SetSRID(ST_MakePoint(29.0260, 40.9908), 4326),
        'Kadiköy, Istanbul', 'd0000001-0000-0000-0000-000000000002', 'RESEARCH_GRADE', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'https://placehold.co/800x600/e2e8f0/475569?text=Hooded+Crow', 0, now());

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'd0000001-0000-0000-0000-000000000002', 'Hooded crow — grey body, black head', TRUE, FALSE, now(), now()),
('10000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'd0000001-0000-0000-0000-000000000002', 'Corvus cornix, confirmed', TRUE, FALSE, now(), now());


-- Observation 3: Carol sees a Grey Heron at Küçükçekmece Lake
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
        'Heron standing still at the lake edge, hunting fish.',
        '2026-03-12 07:15:00', ST_SetSRID(ST_MakePoint(28.7580, 41.0050), 4326),
        'Küçükçekmece Lake, Istanbul', 'd0000001-0000-0000-0000-000000000004', 'NEEDS_ID', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000003', 'https://placehold.co/800x600/e2e8f0/475569?text=Grey+Heron', 0, now());

-- Only one ID so far → Needs ID
INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'd0000001-0000-0000-0000-000000000004', 'Looks like a grey heron to me', TRUE, FALSE, now(), now());


-- Observation 4: Alice spots House Sparrows at Sultanahmet
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
        'Flock of sparrows hopping around the cafe tables.',
        '2026-03-13 12:30:00', ST_SetSRID(ST_MakePoint(28.9784, 41.0054), 4326),
        'Sultanahmet, Istanbul', 'd0000001-0000-0000-0000-000000000007', 'RESEARCH_GRADE', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000004', 'https://placehold.co/800x600/e2e8f0/475569?text=House+Sparrow', 0, now()),
('f0000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000004', 'https://placehold.co/800x600/e2e8f0/475569?text=House+Sparrow+2', 1, now());

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'd0000001-0000-0000-0000-000000000007', NULL, TRUE, FALSE, now(), now()),
('10000001-0000-0000-0000-000000000007', 'e0000001-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'd0000001-0000-0000-0000-000000000007', 'Passer domesticus — male based on markings', TRUE, FALSE, now(), now());


-- Observation 5: Bob spots a Great Cormorant at the Golden Horn (no ID yet)
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222',
        'Dark bird sitting on a rock, spreading wings to dry. What species is this?',
        '2026-03-14 16:00:00', ST_SetSRID(ST_MakePoint(28.9550, 41.0301), 4326),
        'Golden Horn, Istanbul', 'NEEDS_ID', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000005', 'https://placehold.co/800x600/e2e8f0/475569?text=Cormorant', 0, now());


-- Observation 6: Carol spots a Eurasian Magpie at Belgrad Forest
INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES ('e0000001-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333',
        'Beautiful magpie with iridescent feathers. Love the blue-green sheen on the tail!',
        '2026-03-14 10:45:00', ST_SetSRID(ST_MakePoint(28.9731, 41.1820), 4326),
        'Belgrad Forest, Istanbul', 'd0000001-0000-0000-0000-000000000018', 'NEEDS_ID', FALSE, now(), now());

INSERT INTO observation_images (id, observation_id, image_url, position, created_at) VALUES
('f0000001-0000-0000-0000-000000000007', 'e0000001-0000-0000-0000-000000000006', 'https://placehold.co/800x600/e2e8f0/475569?text=Eurasian+Magpie', 0, now()),
('f0000001-0000-0000-0000-000000000008', 'e0000001-0000-0000-0000-000000000006', 'https://placehold.co/800x600/e2e8f0/475569?text=Eurasian+Magpie+Tail', 1, now());

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at) VALUES
('10000001-0000-0000-0000-000000000008', 'e0000001-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'd0000001-0000-0000-0000-000000000018', 'Pica pica — unmistakable', TRUE, FALSE, now(), now());
