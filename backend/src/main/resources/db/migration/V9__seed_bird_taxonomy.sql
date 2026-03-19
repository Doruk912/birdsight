-- Seed bird taxonomy: Orders → Families → Genera → Species
-- 30 species requested by user with full classification hierarchy

-- ============================================================
-- ORDERS
-- ============================================================
INSERT INTO taxa (id, rank, scientific_name, common_name, parent_id, created_at, updated_at) VALUES
('a0000001-0000-0000-0000-000000000001', 'ORDER', 'Charadriiformes', 'Shorebirds & Gulls', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000002', 'ORDER', 'Passeriformes', 'Perching Birds', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000003', 'ORDER', 'Columbiformes', 'Pigeons & Doves', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000004', 'ORDER', 'Pelecaniformes', 'Pelicans & Herons', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000005', 'ORDER', 'Suliformes', 'Cormorants & Boobies', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000006', 'ORDER', 'Psittaciformes', 'Parrots', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000007', 'ORDER', 'Anseriformes', 'Waterfowl', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000008', 'ORDER', 'Accipitriformes', 'Hawks & Eagles', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000009', 'ORDER', 'Apodiformes', 'Swifts', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000010', 'ORDER', 'Gruiformes', 'Cranes & Rails', NULL, now(), now()),
('a0000001-0000-0000-0000-000000000011', 'ORDER', 'Ciconiiformes', 'Storks', NULL, now(), now());

-- ============================================================
-- FAMILIES
-- ============================================================
INSERT INTO taxa (id, rank, scientific_name, common_name, parent_id, created_at, updated_at) VALUES
-- Charadriiformes families
('b0000001-0000-0000-0000-000000000001', 'FAMILY', 'Laridae', 'Gulls', 'a0000001-0000-0000-0000-000000000001', now(), now()),
-- Passeriformes families
('b0000001-0000-0000-0000-000000000002', 'FAMILY', 'Corvidae', 'Crows & Jays', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000003', 'FAMILY', 'Passeridae', 'Old World Sparrows', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000004', 'FAMILY', 'Sturnidae', 'Starlings & Mynas', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000005', 'FAMILY', 'Paridae', 'Tits', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000006', 'FAMILY', 'Fringillidae', 'Finches', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000007', 'FAMILY', 'Muscicapidae', 'Old World Flycatchers', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000008', 'FAMILY', 'Turdidae', 'Thrushes', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000009', 'FAMILY', 'Motacillidae', 'Wagtails & Pipits', 'a0000001-0000-0000-0000-000000000002', now(), now()),
('b0000001-0000-0000-0000-000000000010', 'FAMILY', 'Hirundinidae', 'Swallows', 'a0000001-0000-0000-0000-000000000002', now(), now()),
-- Columbiformes families
('b0000001-0000-0000-0000-000000000011', 'FAMILY', 'Columbidae', 'Pigeons & Doves', 'a0000001-0000-0000-0000-000000000003', now(), now()),
-- Pelecaniformes families
('b0000001-0000-0000-0000-000000000012', 'FAMILY', 'Ardeidae', 'Herons', 'a0000001-0000-0000-0000-000000000004', now(), now()),
-- Suliformes families
('b0000001-0000-0000-0000-000000000013', 'FAMILY', 'Phalacrocoracidae', 'Cormorants', 'a0000001-0000-0000-0000-000000000005', now(), now()),
-- Psittaciformes families
('b0000001-0000-0000-0000-000000000014', 'FAMILY', 'Psittacidae', 'Parrots', 'a0000001-0000-0000-0000-000000000006', now(), now()),
-- Anseriformes families
('b0000001-0000-0000-0000-000000000015', 'FAMILY', 'Anatidae', 'Ducks & Geese', 'a0000001-0000-0000-0000-000000000007', now(), now()),
-- Accipitriformes families
('b0000001-0000-0000-0000-000000000016', 'FAMILY', 'Accipitridae', 'Hawks & Eagles', 'a0000001-0000-0000-0000-000000000008', now(), now()),
-- Apodiformes families
('b0000001-0000-0000-0000-000000000017', 'FAMILY', 'Apodidae', 'Swifts', 'a0000001-0000-0000-0000-000000000009', now(), now()),
-- Gruiformes families
('b0000001-0000-0000-0000-000000000018', 'FAMILY', 'Rallidae', 'Rails & Coots', 'a0000001-0000-0000-0000-000000000010', now(), now()),
-- Ciconiiformes families
('b0000001-0000-0000-0000-000000000019', 'FAMILY', 'Ciconiidae', 'Storks', 'a0000001-0000-0000-0000-000000000011', now(), now());

-- ============================================================
-- GENERA
-- ============================================================
INSERT INTO taxa (id, rank, scientific_name, common_name, parent_id, created_at, updated_at) VALUES
-- Laridae genera
('c0000001-0000-0000-0000-000000000001', 'GENUS', 'Larus', NULL, 'b0000001-0000-0000-0000-000000000001', now(), now()),
('c0000001-0000-0000-0000-000000000002', 'GENUS', 'Chroicocephalus', NULL, 'b0000001-0000-0000-0000-000000000001', now(), now()),
-- Corvidae genera
('c0000001-0000-0000-0000-000000000003', 'GENUS', 'Corvus', NULL, 'b0000001-0000-0000-0000-000000000002', now(), now()),
('c0000001-0000-0000-0000-000000000004', 'GENUS', 'Coloeus', NULL, 'b0000001-0000-0000-0000-000000000002', now(), now()),
('c0000001-0000-0000-0000-000000000005', 'GENUS', 'Pica', NULL, 'b0000001-0000-0000-0000-000000000002', now(), now()),
('c0000001-0000-0000-0000-000000000006', 'GENUS', 'Garrulus', NULL, 'b0000001-0000-0000-0000-000000000002', now(), now()),
-- Passeridae genera
('c0000001-0000-0000-0000-000000000007', 'GENUS', 'Passer', NULL, 'b0000001-0000-0000-0000-000000000003', now(), now()),
-- Sturnidae genera
('c0000001-0000-0000-0000-000000000008', 'GENUS', 'Acridotheres', NULL, 'b0000001-0000-0000-0000-000000000004', now(), now()),
('c0000001-0000-0000-0000-000000000009', 'GENUS', 'Sturnus', NULL, 'b0000001-0000-0000-0000-000000000004', now(), now()),
-- Paridae genera
('c0000001-0000-0000-0000-000000000010', 'GENUS', 'Parus', NULL, 'b0000001-0000-0000-0000-000000000005', now(), now()),
('c0000001-0000-0000-0000-000000000011', 'GENUS', 'Cyanistes', NULL, 'b0000001-0000-0000-0000-000000000005', now(), now()),
-- Fringillidae genera
('c0000001-0000-0000-0000-000000000012', 'GENUS', 'Fringilla', NULL, 'b0000001-0000-0000-0000-000000000006', now(), now()),
-- Muscicapidae genera
('c0000001-0000-0000-0000-000000000013', 'GENUS', 'Erithacus', NULL, 'b0000001-0000-0000-0000-000000000007', now(), now()),
-- Turdidae genera
('c0000001-0000-0000-0000-000000000014', 'GENUS', 'Turdus', NULL, 'b0000001-0000-0000-0000-000000000008', now(), now()),
-- Motacillidae genera
('c0000001-0000-0000-0000-000000000015', 'GENUS', 'Motacilla', NULL, 'b0000001-0000-0000-0000-000000000009', now(), now()),
-- Hirundinidae genera
('c0000001-0000-0000-0000-000000000016', 'GENUS', 'Hirundo', NULL, 'b0000001-0000-0000-0000-000000000010', now(), now()),
-- Columbidae genera
('c0000001-0000-0000-0000-000000000017', 'GENUS', 'Spilopelia', NULL, 'b0000001-0000-0000-0000-000000000011', now(), now()),
('c0000001-0000-0000-0000-000000000018', 'GENUS', 'Columba', NULL, 'b0000001-0000-0000-0000-000000000011', now(), now()),
('c0000001-0000-0000-0000-000000000019', 'GENUS', 'Streptopelia', NULL, 'b0000001-0000-0000-0000-000000000011', now(), now()),
-- Ardeidae genera
('c0000001-0000-0000-0000-000000000020', 'GENUS', 'Ardea', NULL, 'b0000001-0000-0000-0000-000000000012', now(), now()),
-- Phalacrocoracidae genera
('c0000001-0000-0000-0000-000000000021', 'GENUS', 'Phalacrocorax', NULL, 'b0000001-0000-0000-0000-000000000013', now(), now()),
('c0000001-0000-0000-0000-000000000022', 'GENUS', 'Gulosus', NULL, 'b0000001-0000-0000-0000-000000000013', now(), now()),
('c0000001-0000-0000-0000-000000000023', 'GENUS', 'Microcarbo', NULL, 'b0000001-0000-0000-0000-000000000013', now(), now()),
-- Psittacidae genera
('c0000001-0000-0000-0000-000000000024', 'GENUS', 'Psittacula', NULL, 'b0000001-0000-0000-0000-000000000014', now(), now()),
-- Anatidae genera
('c0000001-0000-0000-0000-000000000025', 'GENUS', 'Anas', NULL, 'b0000001-0000-0000-0000-000000000015', now(), now()),
-- Accipitridae genera
('c0000001-0000-0000-0000-000000000026', 'GENUS', 'Buteo', NULL, 'b0000001-0000-0000-0000-000000000016', now(), now()),
('c0000001-0000-0000-0000-000000000027', 'GENUS', 'Accipiter', NULL, 'b0000001-0000-0000-0000-000000000016', now(), now()),
-- Apodidae genera
('c0000001-0000-0000-0000-000000000028', 'GENUS', 'Tachymarptis', NULL, 'b0000001-0000-0000-0000-000000000017', now(), now()),
-- Rallidae genera
('c0000001-0000-0000-0000-000000000029', 'GENUS', 'Fulica', NULL, 'b0000001-0000-0000-0000-000000000018', now(), now()),
-- Ciconiidae genera
('c0000001-0000-0000-0000-000000000030', 'GENUS', 'Ciconia', NULL, 'b0000001-0000-0000-0000-000000000019', now(), now());

-- ============================================================
-- SPECIES (the 30 requested species)
-- ============================================================
INSERT INTO taxa (id, rank, scientific_name, common_name, parent_id, created_at, updated_at) VALUES
('d0000001-0000-0000-0000-000000000001', 'SPECIES', 'Larus michahellis', 'Yellow-legged Gull', 'c0000001-0000-0000-0000-000000000001', now(), now()),
('d0000001-0000-0000-0000-000000000002', 'SPECIES', 'Corvus cornix', 'Hooded Crow', 'c0000001-0000-0000-0000-000000000003', now(), now()),
('d0000001-0000-0000-0000-000000000003', 'SPECIES', 'Spilopelia senegalensis', 'Laughing Dove', 'c0000001-0000-0000-0000-000000000017', now(), now()),
('d0000001-0000-0000-0000-000000000004', 'SPECIES', 'Ardea cinerea', 'Grey Heron', 'c0000001-0000-0000-0000-000000000020', now(), now()),
('d0000001-0000-0000-0000-000000000005', 'SPECIES', 'Phalacrocorax carbo', 'Great Cormorant', 'c0000001-0000-0000-0000-000000000021', now(), now()),
('d0000001-0000-0000-0000-000000000006', 'SPECIES', 'Chroicocephalus ridibundus', 'Black-headed Gull', 'c0000001-0000-0000-0000-000000000002', now(), now()),
('d0000001-0000-0000-0000-000000000007', 'SPECIES', 'Passer domesticus', 'House Sparrow', 'c0000001-0000-0000-0000-000000000007', now(), now()),
('d0000001-0000-0000-0000-000000000008', 'SPECIES', 'Psittacula krameri', 'Rose-ringed Parakeet', 'c0000001-0000-0000-0000-000000000024', now(), now()),
('d0000001-0000-0000-0000-000000000009', 'SPECIES', 'Gulosus aristotelis', 'European Shag', 'c0000001-0000-0000-0000-000000000022', now(), now()),
('d0000001-0000-0000-0000-000000000010', 'SPECIES', 'Columba livia', 'Rock Dove', 'c0000001-0000-0000-0000-000000000018', now(), now()),
('d0000001-0000-0000-0000-000000000011', 'SPECIES', 'Acridotheres tristis', 'Common Myna', 'c0000001-0000-0000-0000-000000000008', now(), now()),
('d0000001-0000-0000-0000-000000000012', 'SPECIES', 'Sturnus vulgaris', 'Common Starling', 'c0000001-0000-0000-0000-000000000009', now(), now()),
('d0000001-0000-0000-0000-000000000013', 'SPECIES', 'Anas platyrhynchos', 'Mallard', 'c0000001-0000-0000-0000-000000000025', now(), now()),
('d0000001-0000-0000-0000-000000000014', 'SPECIES', 'Coloeus monedula', 'Eurasian Jackdaw', 'c0000001-0000-0000-0000-000000000004', now(), now()),
('d0000001-0000-0000-0000-000000000015', 'SPECIES', 'Parus major', 'Great Tit', 'c0000001-0000-0000-0000-000000000010', now(), now()),
('d0000001-0000-0000-0000-000000000016', 'SPECIES', 'Fringilla coelebs', 'Common Chaffinch', 'c0000001-0000-0000-0000-000000000012', now(), now()),
('d0000001-0000-0000-0000-000000000017', 'SPECIES', 'Microcarbo pygmaeus', 'Pygmy Cormorant', 'c0000001-0000-0000-0000-000000000023', now(), now()),
('d0000001-0000-0000-0000-000000000018', 'SPECIES', 'Pica pica', 'Eurasian Magpie', 'c0000001-0000-0000-0000-000000000005', now(), now()),
('d0000001-0000-0000-0000-000000000019', 'SPECIES', 'Erithacus rubecula', 'European Robin', 'c0000001-0000-0000-0000-000000000013', now(), now()),
('d0000001-0000-0000-0000-000000000020', 'SPECIES', 'Buteo buteo', 'Common Buzzard', 'c0000001-0000-0000-0000-000000000026', now(), now()),
('d0000001-0000-0000-0000-000000000021', 'SPECIES', 'Tachymarptis melba', 'Alpine Swift', 'c0000001-0000-0000-0000-000000000028', now(), now()),
('d0000001-0000-0000-0000-000000000022', 'SPECIES', 'Fulica atra', 'Eurasian Coot', 'c0000001-0000-0000-0000-000000000029', now(), now()),
('d0000001-0000-0000-0000-000000000023', 'SPECIES', 'Ciconia ciconia', 'White Stork', 'c0000001-0000-0000-0000-000000000030', now(), now()),
('d0000001-0000-0000-0000-000000000024', 'SPECIES', 'Motacilla alba', 'White Wagtail', 'c0000001-0000-0000-0000-000000000015', now(), now()),
('d0000001-0000-0000-0000-000000000025', 'SPECIES', 'Accipiter nisus', 'Eurasian Sparrowhawk', 'c0000001-0000-0000-0000-000000000027', now(), now()),
('d0000001-0000-0000-0000-000000000026', 'SPECIES', 'Turdus merula', 'Common Blackbird', 'c0000001-0000-0000-0000-000000000014', now(), now()),
('d0000001-0000-0000-0000-000000000027', 'SPECIES', 'Garrulus glandarius', 'Eurasian Jay', 'c0000001-0000-0000-0000-000000000006', now(), now()),
('d0000001-0000-0000-0000-000000000028', 'SPECIES', 'Cyanistes caeruleus', 'Eurasian Blue Tit', 'c0000001-0000-0000-0000-000000000011', now(), now()),
('d0000001-0000-0000-0000-000000000029', 'SPECIES', 'Streptopelia decaocto', 'Eurasian Collared Dove', 'c0000001-0000-0000-0000-000000000019', now(), now()),
('d0000001-0000-0000-0000-000000000030', 'SPECIES', 'Hirundo rustica', 'Barn Swallow', 'c0000001-0000-0000-0000-000000000016', now(), now());
