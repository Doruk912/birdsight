INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Observed a Chroicocephalus ridibundus near Istanbul.', '2025-04-24 08:32:06.900888',
           ST_SetSRID(ST_MakePoint(29.29309, 41.203837), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-04-24 08:32:06.900888', '2025-04-24 08:32:06.900888'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('4606ddd8-8aa1-498e-8563-bda6ee600cf1', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636545454/original.jpg', 0, '2025-04-24 08:32:06.900888');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('866507a0-cd08-4502-979a-89ab9d3f1b53', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636523206/medium.jpg', 1, '2025-04-24 08:32:06.900888');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('38484357-450a-4d40-987c-28ff70035f57', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636528069/medium.jpg', 2, '2025-04-24 08:32:06.900888');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '07a7d98f-3c41-4c30-adca-007fb5cae8e1', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-04-24 09:23:06.900888', '2025-04-24 09:23:06.900888'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '3ae4d42d-87e3-49d7-947e-5bb894ba9407', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           'Looks more like a Sturnus vulgaris to me.', TRUE, FALSE, '2025-04-24 16:23:06.900888', '2025-04-24 16:23:06.900888'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('c2ead81d-26c5-4d0c-b404-8d1b6a2ccdf7', 'bfaa6b4e-ee29-4d3b-a70d-a18466f372a0', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Are you sure about the ID?', FALSE, '2025-04-26 15:32:06.900888', '2025-04-26 15:32:06.900888');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '2fdfd1dc-c378-4e95-9c4a-6aa04b7401f9', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Streptopelia decaocto near Istanbul.', '2025-10-14 15:05:06.901223',
           ST_SetSRID(ST_MakePoint(29.027912, 41.158489), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Streptopelia decaocto' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-10-14 15:05:06.901223', '2025-10-14 15:05:06.901223'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('1a0d1518-2b0a-4f2f-b603-632ce80323a3', '2fdfd1dc-c378-4e95-9c4a-6aa04b7401f9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636555149/medium.jpg', 0, '2025-10-14 15:05:06.901223');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e50e8880-7893-486d-b4ed-bb451ef4e783', '2fdfd1dc-c378-4e95-9c4a-6aa04b7401f9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636544311/medium.jpg', 1, '2025-10-14 15:05:06.901223');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('bf7fe5af-3f5e-4687-be07-8b6fcbf3d217', '2fdfd1dc-c378-4e95-9c4a-6aa04b7401f9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636543951/medium.jpg', 2, '2025-10-14 15:05:06.901223');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '5a89c725-21c6-4b98-9267-8f375d727bd2', '2fdfd1dc-c378-4e95-9c4a-6aa04b7401f9', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Streptopelia decaocto' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-14 15:30:06.901223', '2025-10-14 15:30:06.901223'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2026-02-28 01:27:06.901323',
           ST_SetSRID(ST_MakePoint(29.064, 41.220876), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-02-28 01:27:06.901323', '2026-02-28 01:27:06.901323'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('f57adf76-5a4e-4ca3-bcd7-f16c3454156b', '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636542422/medium.jpg', 0, '2026-02-28 01:27:06.901323');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('2e42d629-849b-46fc-9944-8fb228d04d0d', '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636542023/medium.jpg', 1, '2026-02-28 01:27:06.901323');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('8900de0d-5e88-4205-8150-561e70ea5f28', '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636547267/medium.jpg', 2, '2026-02-28 01:27:06.901323');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '1a132a73-7e96-4866-94ed-84b0a58903ba', '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-28 02:10:06.901323', '2026-02-28 02:10:06.901323'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '0a2f01ca-1546-41ad-8797-6d36a30d4b62', '50a060cf-f0c9-46ec-99a9-ad5d2a2e44e8', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-28 05:10:06.901323', '2026-02-28 05:10:06.901323'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '8c4f8795-0f9c-457e-a32c-49034a9c5e32', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Fulica atra near Istanbul.', '2025-11-22 10:54:06.901434',
           ST_SetSRID(ST_MakePoint(28.714991, 40.925547), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fulica atra' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-11-22 10:54:06.901434', '2025-11-22 10:54:06.901434'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('41cb6fe3-e252-4f10-abf0-d513fb6f496f', '8c4f8795-0f9c-457e-a32c-49034a9c5e32', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636540976/medium.jpg', 0, '2025-11-22 10:54:06.901434');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('9934e12e-00a6-4a03-8a9f-508e17675890', '8c4f8795-0f9c-457e-a32c-49034a9c5e32', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636539283/medium.jpg', 1, '2025-11-22 10:54:06.901434');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('10dc6838-e7e9-44c2-abc4-11a5e5db7a10', '8c4f8795-0f9c-457e-a32c-49034a9c5e32', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636538878/medium.jpg', 2, '2025-11-22 10:54:06.901434');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '110715e7-220f-4480-9e2a-cdcce5bf63e9', '8c4f8795-0f9c-457e-a32c-49034a9c5e32', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Fulica atra' LIMIT 1),
           NULL, TRUE, FALSE, '2025-11-22 11:48:06.901434', '2025-11-22 11:48:06.901434'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'e519a63a-7ce1-4930-a767-fc8246e961ce', '8c4f8795-0f9c-457e-a32c-49034a9c5e32', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'Looks more like a Fringilla coelebs to me.', TRUE, FALSE, '2025-11-24 05:48:06.901434', '2025-11-24 05:48:06.901434'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Observed a Pica pica near Istanbul.', '2025-06-08 02:33:06.901549',
           ST_SetSRID(ST_MakePoint(29.347215, 41.201119), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-06-08 02:33:06.901549', '2025-06-08 02:33:06.901549'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('647eb8bf-4c99-4362-9f02-bc7523bbf57e', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636583306/original.jpg', 0, '2025-06-08 02:33:06.901549');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('eb4348d3-f1ad-4910-928c-ddf4e2b45ae8', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'https://static.inaturalist.org/photos/636602217/original.jpg', 1, '2025-06-08 02:33:06.901549');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('125ea83d-c18e-4cff-baf3-aae0b5aa8d00', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636544440/medium.jpg', 2, '2025-06-08 02:33:06.901549');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '009074df-b3e8-40ab-bc20-a25c3d09eaad', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           NULL, TRUE, FALSE, '2025-06-08 03:05:06.901549', '2025-06-08 03:05:06.901549'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'aab60852-6724-4d32-a136-44134e7179f8', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Larus michahellis' LIMIT 1),
           'Looks more like a Larus michahellis to me.', TRUE, FALSE, '2025-06-09 01:05:06.901549', '2025-06-09 01:05:06.901549'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('33633167-05a3-4871-9ba3-1bb36c74c3ac', 'dc24cc99-3aea-4886-9ecc-458bf60ff1bc', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Are you sure about the ID?', FALSE, '2025-06-09 06:33:06.901549', '2025-06-09 06:33:06.901549');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '2fa19956-c90f-4e2b-a943-10a1faffc264', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', '', '2025-12-20 10:23:06.901679',
           ST_SetSRID(ST_MakePoint(29.33451, 40.915675), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-12-20 10:23:06.901679', '2025-12-20 10:23:06.901679'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('8a946412-c2f5-4524-bc76-8b429a07fbde', '2fa19956-c90f-4e2b-a943-10a1faffc264', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636573851/original.jpg', 0, '2025-12-20 10:23:06.901679');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('b4bc07bf-775b-46f6-8c27-ebdf40b58494', '2fa19956-c90f-4e2b-a943-10a1faffc264', 'https://static.inaturalist.org/photos/636542260/medium.jpg', 1, '2025-12-20 10:23:06.901679');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('25120540-a0ea-486e-9b44-fc557acfbb00', '2fa19956-c90f-4e2b-a943-10a1faffc264', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636524202/medium.jpg', 2, '2025-12-20 10:23:06.901679');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '46002430-6ba0-4219-95de-07df6f6e0e9a', '2fa19956-c90f-4e2b-a943-10a1faffc264', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           NULL, TRUE, FALSE, '2025-12-20 10:39:06.901679', '2025-12-20 10:39:06.901679'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7182f6dd-409a-4f4d-b230-0a7d001dd7e6', '2fa19956-c90f-4e2b-a943-10a1faffc264', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-12-21 18:39:06.901679', '2025-12-21 18:39:06.901679'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('77e18eb1-e85a-41db-bcf8-933086f8328e', '2fa19956-c90f-4e2b-a943-10a1faffc264', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Amazing sighting!', FALSE, '2025-12-22 13:23:06.901679', '2025-12-22 13:23:06.901679');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '577a01e9-6a14-480a-8784-367bdb1103e0', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Observed a Tachymarptis melba near Istanbul.', '2025-09-23 14:49:06.901807',
           ST_SetSRID(ST_MakePoint(28.973666, 41.163416), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-09-23 14:49:06.901807', '2025-09-23 14:49:06.901807'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a028b4b9-9bca-4f6e-9492-0d8bd4591271', '577a01e9-6a14-480a-8784-367bdb1103e0', 'https://inaturalist-open-data.s3.amazonaws.com/photos/635702716/original.jpg', 0, '2025-09-23 14:49:06.901807');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('85670116-3d6b-4fcd-8410-fcade0f63791', '577a01e9-6a14-480a-8784-367bdb1103e0', 'https://static.inaturalist.org/photos/636498124/medium.jpg', 1, '2025-09-23 14:49:06.901807');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('01043016-a0ec-4d9b-bb06-746c02032474', '577a01e9-6a14-480a-8784-367bdb1103e0', 'https://static.inaturalist.org/photos/636161009/medium.jpg', 2, '2025-09-23 14:49:06.901807');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '244c8f26-ae72-45a9-bf99-9f440ad6ae1d', '577a01e9-6a14-480a-8784-367bdb1103e0', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           NULL, TRUE, FALSE, '2025-09-23 15:00:06.901807', '2025-09-23 15:00:06.901807'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'bd643099-d479-446d-844b-eab6ef099354', '577a01e9-6a14-480a-8784-367bdb1103e0', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-09-23 16:00:06.901807', '2025-09-23 16:00:06.901807'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'c7b2c07d-1872-4390-a191-03b5b5ec64e7', '9835df77-6efd-4c5e-8697-cc1a95674eb6', '', '2025-10-11 18:52:06.901903',
           ST_SetSRID(ST_MakePoint(28.86765, 41.188274), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-10-11 18:52:06.901903', '2025-10-11 18:52:06.901903'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d04effdf-1872-4727-b347-67a43b127318', 'c7b2c07d-1872-4390-a191-03b5b5ec64e7', 'https://static.inaturalist.org/photos/636498124/original.jpg', 0, '2025-10-11 18:52:06.901903');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e14ae961-44c2-466b-b577-b9dd3716b3c9', 'c7b2c07d-1872-4390-a191-03b5b5ec64e7', 'https://static.inaturalist.org/photos/636498124/medium.jpg', 1, '2025-10-11 18:52:06.901903');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('780d36e9-eb64-4aca-a263-9a96d8634e22', 'c7b2c07d-1872-4390-a191-03b5b5ec64e7', 'https://static.inaturalist.org/photos/636161009/medium.jpg', 2, '2025-10-11 18:52:06.901903');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'f989e95d-acc8-4e80-9656-4f8a317500d8', 'c7b2c07d-1872-4390-a191-03b5b5ec64e7', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-11 19:39:06.901903', '2025-10-11 19:39:06.901903'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '49fbb4c3-679a-421a-bd32-2670b6a6e230', '16795721-9825-4046-bad9-70dd300a2e0f', 'Observed a Coloeus monedula near Istanbul.', '2025-12-28 09:39:06.901979',
           ST_SetSRID(ST_MakePoint(28.761457, 41.05231), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-12-28 09:39:06.901979', '2025-12-28 09:39:06.901979'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e2d2bf49-9a9b-4fb7-81e8-0f71011c0140', '49fbb4c3-679a-421a-bd32-2670b6a6e230', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636598312/original.jpg', 0, '2025-12-28 09:39:06.901979');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('91d07275-ffea-44d6-a795-4f4053f36ec2', '49fbb4c3-679a-421a-bd32-2670b6a6e230', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636548909/medium.jpg', 1, '2025-12-28 09:39:06.901979');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('45368211-86f5-4229-8db9-96064d923bfd', '49fbb4c3-679a-421a-bd32-2670b6a6e230', 'https://static.inaturalist.org/photos/636537815/medium.jpg', 2, '2025-12-28 09:39:06.901979');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '33dc60a1-a517-42e5-bea5-aa9b1b9aa4cd', '49fbb4c3-679a-421a-bd32-2670b6a6e230', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-12-28 09:54:06.901979', '2025-12-28 09:54:06.901979'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('6b375519-1c9b-472e-a12b-0ca123a79dc3', '49fbb4c3-679a-421a-bd32-2670b6a6e230', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Beautiful bird, nice photo.', FALSE, '2025-12-30 16:39:06.901979', '2025-12-30 16:39:06.901979');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '8d7e4651-d9a3-4687-a21c-361052a93ce9', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Acridotheres tristis near Istanbul.', '2025-12-14 19:36:06.902073',
           ST_SetSRID(ST_MakePoint(29.090851, 41.209002), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-12-14 19:36:06.902073', '2025-12-14 19:36:06.902073'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('54c40656-d859-4eb4-96ab-da470328a1bb', '8d7e4651-d9a3-4687-a21c-361052a93ce9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636969523/original.jpg', 0, '2025-12-14 19:36:06.902073');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('bc3c3f68-56a2-428e-a9ef-9e780d1b0733', '8d7e4651-d9a3-4687-a21c-361052a93ce9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636449260/medium.jpg', 1, '2025-12-14 19:36:06.902073');

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a1be051e-de9d-4a8f-b7a6-9db3811cdc5e', '8d7e4651-d9a3-4687-a21c-361052a93ce9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636435687/medium.jpg', 2, '2025-12-14 19:36:06.902073');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'ab0fa6ad-1d04-471e-b827-6a03af081189', '8d7e4651-d9a3-4687-a21c-361052a93ce9', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           NULL, TRUE, FALSE, '2025-12-14 19:56:06.902073', '2025-12-14 19:56:06.902073'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'e0ef21b9-0da4-44f8-8a21-a769c9e03182', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', '', '2025-10-20 02:27:06.902145',
           ST_SetSRID(ST_MakePoint(29.162049, 41.130369), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Psittacula krameri' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-20 02:27:06.902145', '2025-10-20 02:27:06.902145'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('584175ef-3b27-4cf8-bcee-ce826507ea27', 'e0ef21b9-0da4-44f8-8a21-a769c9e03182', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636553899/medium.jpg', 0, '2025-10-20 02:27:06.902145');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7f132ad9-b9e3-4028-b8e2-5d8c95786725', 'e0ef21b9-0da4-44f8-8a21-a769c9e03182', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Psittacula krameri' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-20 03:17:06.902145', '2025-10-20 03:17:06.902145'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'eaeeda29-01c6-4d47-9143-21acfa8fd5a8', 'e0ef21b9-0da4-44f8-8a21-a769c9e03182', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Psittacula krameri' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-21 11:17:06.902145', '2025-10-21 11:17:06.902145'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '076a6d49-ce84-47ac-8ef4-f2abf0d49e06', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Observed a Ciconia ciconia near Istanbul.', '2025-09-09 12:13:06.902215',
           ST_SetSRID(ST_MakePoint(29.114346, 41.155936), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Ciconia ciconia' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-09-09 12:13:06.902215', '2025-09-09 12:13:06.902215'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a401c8f2-7ab8-40ff-b5c6-bcfadcb9daaf', '076a6d49-ce84-47ac-8ef4-f2abf0d49e06', 'https://static.inaturalist.org/photos/636063866/original.jpg', 0, '2025-09-09 12:13:06.902215');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b95c3fd3-57b0-41f9-a464-f707651bf17a', '076a6d49-ce84-47ac-8ef4-f2abf0d49e06', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Ciconia ciconia' LIMIT 1),
           NULL, TRUE, FALSE, '2025-09-09 13:05:06.902215', '2025-09-09 13:05:06.902215'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '057aa70c-116f-4094-a21c-2a6f3b078891', '076a6d49-ce84-47ac-8ef4-f2abf0d49e06', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           'Looks more like a Sturnus vulgaris to me.', TRUE, FALSE, '2025-09-10 17:05:06.902215', '2025-09-10 17:05:06.902215'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'cedd4f4f-8f31-4dca-9e52-13468b63ab0f', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Cyanistes caeruleus near Istanbul.', '2025-11-03 10:56:06.902289',
           ST_SetSRID(ST_MakePoint(29.211127, 41.200045), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Cyanistes caeruleus' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-11-03 10:56:06.902289', '2025-11-03 10:56:06.902289'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('70fe26af-90ce-4505-b579-50d7025313a5', 'cedd4f4f-8f31-4dca-9e52-13468b63ab0f', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636980186/original.jpg', 0, '2025-11-03 10:56:06.902289');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'c1155668-0c6d-415e-bb36-b0e776014c82', 'cedd4f4f-8f31-4dca-9e52-13468b63ab0f', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Cyanistes caeruleus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-11-03 11:29:06.902289', '2025-11-03 11:29:06.902289'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '24d1cb49-50bb-4553-9843-0f48df185cd2', 'cedd4f4f-8f31-4dca-9e52-13468b63ab0f', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Cyanistes caeruleus' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-11-05 08:29:06.902289', '2025-11-05 08:29:06.902289'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('29e725cb-03c9-4dee-8047-75fb6a2be300', 'cedd4f4f-8f31-4dca-9e52-13468b63ab0f', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Beautiful bird, nice photo.', FALSE, '2025-11-04 01:56:06.902289', '2025-11-04 01:56:06.902289');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '12a9172e-0202-49c9-aadf-1b2eb178fb46', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2026-01-10 01:15:06.902376',
           ST_SetSRID(ST_MakePoint(28.902406, 40.96311), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-01-10 01:15:06.902376', '2026-01-10 01:15:06.902376'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('de8dcd25-e018-4c89-b10a-7ad2a1d803be', '12a9172e-0202-49c9-aadf-1b2eb178fb46', 'https://static.inaturalist.org/photos/616292288/original.jpg', 0, '2026-01-10 01:15:06.902376');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b37ceebb-6876-4fcf-97f2-4d18d3524c9f', '12a9172e-0202-49c9-aadf-1b2eb178fb46', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           NULL, TRUE, FALSE, '2026-01-10 01:52:06.902376', '2026-01-10 01:52:06.902376'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '446c6df7-46d5-4507-9c2c-ff220efaaea8', '12a9172e-0202-49c9-aadf-1b2eb178fb46', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-01-11 23:52:06.902376', '2026-01-11 23:52:06.902376'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('266c67b0-cd1f-49f6-a8b6-a8c4112454ec', '12a9172e-0202-49c9-aadf-1b2eb178fb46', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Confirmed, unmistakable pattern.', FALSE, '2026-01-10 12:15:06.902376', '2026-01-10 12:15:06.902376');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'c4a8e117-2904-4ebd-a7c0-e2c7043995d5', '1e78be55-8ee1-41a5-bea3-7ce19037d064', '', '2025-10-20 22:47:06.902464',
           ST_SetSRID(ST_MakePoint(29.249792, 41.247169), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-20 22:47:06.902464', '2025-10-20 22:47:06.902464'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('afbb090d-bd89-4c29-bfe1-0c710ac1b6f7', 'c4a8e117-2904-4ebd-a7c0-e2c7043995d5', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636597638/original.jpg', 0, '2025-10-20 22:47:06.902464');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'f33a110d-1e3d-4627-8e25-9bfc57539584', 'c4a8e117-2904-4ebd-a7c0-e2c7043995d5', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-20 23:34:06.902464', '2025-10-20 23:34:06.902464'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'bd2bf7f5-503c-459a-9e2d-7c2e472697d0', 'c4a8e117-2904-4ebd-a7c0-e2c7043995d5', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-22 19:34:06.902464', '2025-10-22 19:34:06.902464'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '4f0afbed-9ab2-4593-9860-1e72f99c7b4c', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Observed a Pica pica near Istanbul.', '2025-05-06 19:13:06.902560',
           ST_SetSRID(ST_MakePoint(28.788399, 41.103724), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-05-06 19:13:06.902560', '2025-05-06 19:13:06.902560'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('041fba2a-5442-46e9-bb0d-9ba26625ce51', '4f0afbed-9ab2-4593-9860-1e72f99c7b4c', 'https://static.inaturalist.org/photos/636579764/original.jpg', 0, '2025-05-06 19:13:06.902560');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '685074f1-3c7d-4425-9591-0819dac462a4', '4f0afbed-9ab2-4593-9860-1e72f99c7b4c', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           NULL, TRUE, FALSE, '2025-05-06 19:19:06.902560', '2025-05-06 19:19:06.902560'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '4cf66533-da3f-486e-a574-6a78559328ca', '4f0afbed-9ab2-4593-9860-1e72f99c7b4c', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-05-08 19:19:06.902560', '2025-05-08 19:19:06.902560'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('7dc714bc-e5de-4ba7-989c-9fb234116159', '4f0afbed-9ab2-4593-9860-1e72f99c7b4c', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Wow, I have been looking for one of these.', FALSE, '2025-05-09 16:13:06.902560', '2025-05-09 16:13:06.902560');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    'b9a41f4e-50fe-4cce-8e3a-a5674afd0b08', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Sturnus vulgaris near Istanbul.', '2026-02-13 03:53:06.902647',
    ST_SetSRID(ST_MakePoint(28.668632, 40.983853), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2026-02-13 03:53:06.902647', '2026-02-13 03:53:06.902647'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('5758063e-3eaf-4ccd-a883-02b037dc9c9c', 'b9a41f4e-50fe-4cce-8e3a-a5674afd0b08', 'https://static.inaturalist.org/photos/636555249/medium.jpg', 0, '2026-02-13 03:53:06.902647');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '852038dd-f03c-445e-992e-2a5ca5d5e828', 'b9a41f4e-50fe-4cce-8e3a-a5674afd0b08', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    NULL, TRUE, FALSE, '2026-02-13 04:13:06.902647', '2026-02-13 04:13:06.902647'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '590407c6-d063-4740-b3c8-843da20e8081', 'b9a41f4e-50fe-4cce-8e3a-a5674afd0b08', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2026-02-13 05:13:06.902647', '2026-02-13 05:13:06.902647'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '3f15aceb-7b97-4bab-bb9e-71dd6350ef86', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Observed a Sturnus vulgaris near Istanbul.', '2026-01-09 04:42:06.902716',
    ST_SetSRID(ST_MakePoint(28.830266, 41.097102), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    'NEEDS_ID', FALSE, '2026-01-09 04:42:06.902716', '2026-01-09 04:42:06.902716'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('2a145bf3-43b9-43c8-ad91-b2e91bac60a9', '3f15aceb-7b97-4bab-bb9e-71dd6350ef86', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636549592/original.jpg', 0, '2026-01-09 04:42:06.902716');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'ce689d9d-c5fd-424c-b82f-48671e0ab715', '3f15aceb-7b97-4bab-bb9e-71dd6350ef86', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    NULL, TRUE, FALSE, '2026-01-09 05:16:06.902716', '2026-01-09 05:16:06.902716'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '393ff8cf-6a7a-4164-966f-8f4e2647b2bb', '3f15aceb-7b97-4bab-bb9e-71dd6350ef86', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
    (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
    'Looks more like a Acridotheres tristis to me.', TRUE, FALSE, '2026-01-09 19:16:06.902716', '2026-01-09 19:16:06.902716'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('1d0e1d84-afed-479e-8ca7-fbd1bdbda9b3', '3f15aceb-7b97-4bab-bb9e-71dd6350ef86', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Beautiful bird, nice photo.', FALSE, '2026-01-10 11:42:06.902716', '2026-01-10 11:42:06.902716');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '7822bb2b-40fe-4024-8370-b276c27c3a14', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Hirundo rustica near Istanbul.', '2026-03-06 21:27:06.902804',
    ST_SetSRID(ST_MakePoint(29.104997, 40.883087), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2026-03-06 21:27:06.902804', '2026-03-06 21:27:06.902804'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('aa8d292f-df40-4dc7-b379-90379c631b07', '7822bb2b-40fe-4024-8370-b276c27c3a14', 'https://static.inaturalist.org/photos/636555960/original.jpg', 0, '2026-03-06 21:27:06.902804');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '3c899bf1-8c76-4dfb-b120-ad35cca0e7ca', '7822bb2b-40fe-4024-8370-b276c27c3a14', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
    (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
    NULL, TRUE, FALSE, '2026-03-06 22:06:06.902804', '2026-03-06 22:06:06.902804'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '37cc592c-373d-4c4c-ac0b-960afc5df5b3', '7822bb2b-40fe-4024-8370-b276c27c3a14', '214797bd-8eb5-4d1b-b339-219fda0374d8',
    (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2026-03-08 21:06:06.902804', '2026-03-08 21:06:06.902804'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    'b4724025-cdc9-451e-bcf1-961ce706ff56', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Erithacus rubecula near Istanbul.', '2026-02-10 16:50:06.902874',
    ST_SetSRID(ST_MakePoint(29.157775, 41.205278), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
    'NEEDS_ID', FALSE, '2026-02-10 16:50:06.902874', '2026-02-10 16:50:06.902874'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('cfb59408-3418-4ef1-9f4f-282c205352b4', 'b4724025-cdc9-451e-bcf1-961ce706ff56', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636606566/original.jpg', 0, '2026-02-10 16:50:06.902874');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '4304df82-b0bd-4a4c-8683-a0224e1376a9', 'b4724025-cdc9-451e-bcf1-961ce706ff56', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
    (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
    NULL, TRUE, FALSE, '2026-02-10 17:34:06.902874', '2026-02-10 17:34:06.902874'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('50795e98-0b30-49c5-a9c6-ef2da29c6e1c', 'b4724025-cdc9-451e-bcf1-961ce706ff56', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Are you sure about the ID?', FALSE, '2026-02-13 01:50:06.902874', '2026-02-13 01:50:06.902874');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '006626de-3666-470f-9522-99b232f65ca0', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Passer domesticus near Istanbul.', '2025-12-26 00:13:06.902945',
    ST_SetSRID(ST_MakePoint(28.990961, 41.210214), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Passer domesticus' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2025-12-26 00:13:06.902945', '2025-12-26 00:13:06.902945'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('dca547ad-c435-4402-9128-a7987d81537c', '006626de-3666-470f-9522-99b232f65ca0', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636552366/medium.jpg', 0, '2025-12-26 00:13:06.902945');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '16bf8a96-c1e1-4da2-97f3-c289eb0569fb', '006626de-3666-470f-9522-99b232f65ca0', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
    (SELECT id FROM taxa WHERE scientific_name = 'Passer domesticus' LIMIT 1),
    NULL, TRUE, FALSE, '2025-12-26 00:30:06.902945', '2025-12-26 00:30:06.902945'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '6bb63f91-b0e6-45b9-87ed-ea58459adc28', '006626de-3666-470f-9522-99b232f65ca0', '214797bd-8eb5-4d1b-b339-219fda0374d8',
    (SELECT id FROM taxa WHERE scientific_name = 'Passer domesticus' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2025-12-27 13:30:06.902945', '2025-12-27 13:30:06.902945'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '0ce4dc40-8eb7-483c-9153-70990ed7d59e', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Buteo buteo near Istanbul.', '2025-06-04 15:58:06.903015',
    ST_SetSRID(ST_MakePoint(29.194309, 40.883871), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Buteo buteo' LIMIT 1),
    'NEEDS_ID', FALSE, '2025-06-04 15:58:06.903015', '2025-06-04 15:58:06.903015'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('8bb0b6c9-26b7-4b89-89b7-080123ab8de2', '0ce4dc40-8eb7-483c-9153-70990ed7d59e', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636991776/original.jpg', 0, '2025-06-04 15:58:06.903015');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'b6d63039-befa-41c2-ac80-101b42bdb9df', '0ce4dc40-8eb7-483c-9153-70990ed7d59e', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
    (SELECT id FROM taxa WHERE scientific_name = 'Buteo buteo' LIMIT 1),
    NULL, TRUE, FALSE, '2025-06-04 16:23:06.903015', '2025-06-04 16:23:06.903015'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'db00272a-d614-409d-8652-0fe599ed4836', '0ce4dc40-8eb7-483c-9153-70990ed7d59e', '16795721-9825-4046-bad9-70dd300a2e0f',
    (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
    'Looks more like a Acridotheres tristis to me.', TRUE, FALSE, '2025-06-05 17:23:06.903015', '2025-06-05 17:23:06.903015'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '92d21043-d84f-4ce9-bfdc-756f9cb11842', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2026-03-22 06:22:06.903087',
    ST_SetSRID(ST_MakePoint(29.0883, 41.189884), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
    'NEEDS_ID', FALSE, '2026-03-22 06:22:06.903087', '2026-03-22 06:22:06.903087'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('5c42ca59-c75a-47ea-af2c-bc6218383abe', '92d21043-d84f-4ce9-bfdc-756f9cb11842', 'https://inaturalist-open-data.s3.amazonaws.com/photos/634912605/original.jpg', 0, '2026-03-22 06:22:06.903087');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '5aa40495-5441-4f0f-b5e6-e3b7796b5b68', '92d21043-d84f-4ce9-bfdc-756f9cb11842', '16795721-9825-4046-bad9-70dd300a2e0f',
    (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
    NULL, TRUE, FALSE, '2026-03-22 06:56:06.903087', '2026-03-22 06:56:06.903087'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('54551b88-5a34-425e-9956-a2f0f527f369', '92d21043-d84f-4ce9-bfdc-756f9cb11842', '19094605-71ab-468c-8f55-99140d2d1fb9', 'I saw one of these in Kadıköy yesterday.', FALSE, '2026-03-22 19:22:06.903087', '2026-03-22 19:22:06.903087');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    'a5d4acb3-8b1c-4dd3-a857-c32e90112367', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2026-01-05 15:17:06.903278',
    ST_SetSRID(ST_MakePoint(28.632895, 41.09107), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2026-01-05 15:17:06.903278', '2026-01-05 15:17:06.903278'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('54094ced-36a0-4e77-b3f2-c5780d1a43a0', 'a5d4acb3-8b1c-4dd3-a857-c32e90112367', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636587327/original.jpg', 0, '2026-01-05 15:17:06.903278');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '6ba6c0ca-67bf-4bb9-a7f2-033b894be24b', 'a5d4acb3-8b1c-4dd3-a857-c32e90112367', '16795721-9825-4046-bad9-70dd300a2e0f',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    NULL, TRUE, FALSE, '2026-01-05 15:36:06.903278', '2026-01-05 15:36:06.903278'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '0ba02c9b-04b3-4d02-bb63-76d6d5b7e96e', 'a5d4acb3-8b1c-4dd3-a857-c32e90112367', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
    (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2026-01-06 19:36:06.903278', '2026-01-06 19:36:06.903278'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('e42d9cfe-dff6-4cd1-8f62-4c6414743b7f', 'a5d4acb3-8b1c-4dd3-a857-c32e90112367', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'I saw one of these in Kadıköy yesterday.', FALSE, '2026-01-07 23:17:06.903278', '2026-01-07 23:17:06.903278');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '2ce2d058-c184-4123-aa99-7702efbc2c67', '214797bd-8eb5-4d1b-b339-219fda0374d8', 'Observed a Spilopelia senegalensis near Istanbul.', '2025-09-29 18:58:06.903360',
    ST_SetSRID(ST_MakePoint(29.175857, 41.226248), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2025-09-29 18:58:06.903360', '2025-09-29 18:58:06.903360'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('ce771037-eec7-4298-96d1-c9496a1ed92f', '2ce2d058-c184-4123-aa99-7702efbc2c67', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636543187/medium.jpg', 0, '2025-09-29 18:58:06.903360');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '327a3cdb-ad21-4c0c-99e0-6236f40b108a', '2ce2d058-c184-4123-aa99-7702efbc2c67', '214797bd-8eb5-4d1b-b339-219fda0374d8',
    (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
    NULL, TRUE, FALSE, '2025-09-29 19:56:06.903360', '2025-09-29 19:56:06.903360'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'b9b65831-7013-4c70-8236-6e9cd4adb820', '2ce2d058-c184-4123-aa99-7702efbc2c67', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
    (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2025-10-01 05:56:06.903360', '2025-10-01 05:56:06.903360'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('d64a14ae-79c6-4525-a9aa-90ea6f881872', '2ce2d058-c184-4123-aa99-7702efbc2c67', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Beautiful bird, nice photo.', FALSE, '2025-10-01 02:58:06.903360', '2025-10-01 02:58:06.903360');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '04b59801-ded3-4160-a04a-dbc9da6d88f4', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Observed a Erithacus rubecula near Istanbul.', '2025-12-27 05:18:06.903441',
    ST_SetSRID(ST_MakePoint(28.919261, 40.912325), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2025-12-27 05:18:06.903441', '2025-12-27 05:18:06.903441'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('cd22e770-fda8-498a-aecd-3541eb822f03', '04b59801-ded3-4160-a04a-dbc9da6d88f4', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636597986/original.jpg', 0, '2025-12-27 05:18:06.903441');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '56d5b790-ab3a-465b-b666-9cd7cbad45e9', '04b59801-ded3-4160-a04a-dbc9da6d88f4', '19094605-71ab-468c-8f55-99140d2d1fb9',
    (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
    NULL, TRUE, FALSE, '2025-12-27 05:26:06.903441', '2025-12-27 05:26:06.903441'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'c820c80a-54b1-47a3-a1d1-b8bc2a84ba1a', '04b59801-ded3-4160-a04a-dbc9da6d88f4', '208ce275-f84a-4a07-b254-1ac56ce149fb',
    (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2025-12-28 21:26:06.903441', '2025-12-28 21:26:06.903441'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    'fc0c5a7b-b905-4c9f-b941-82dcfe06156d', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Fringilla coelebs near Istanbul.', '2026-02-13 04:05:06.903504',
    ST_SetSRID(ST_MakePoint(29.052723, 41.040654), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
    'NEEDS_ID', FALSE, '2026-02-13 04:05:06.903504', '2026-02-13 04:05:06.903504'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a5a798f2-ea1d-4ea1-87df-4d38fc698e44', 'fc0c5a7b-b905-4c9f-b941-82dcfe06156d', 'https://inaturalist-open-data.s3.amazonaws.com/photos/625815392/original.jpg', 0, '2026-02-13 04:05:06.903504');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '92556e99-b7fc-4449-bb20-49c7016ab945', 'fc0c5a7b-b905-4c9f-b941-82dcfe06156d', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
    (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
    NULL, TRUE, FALSE, '2026-02-13 04:39:06.903504', '2026-02-13 04:39:06.903504'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '27d63740-1e4a-48cc-93ba-85488547b0d6', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Ardea cinerea near Istanbul.', '2026-03-18 22:46:06.903550',
    ST_SetSRID(ST_MakePoint(29.058665, 40.88671), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2026-03-18 22:46:06.903550', '2026-03-18 22:46:06.903550'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('36bf9f85-b5e2-41af-a42d-7692b906e352', '27d63740-1e4a-48cc-93ba-85488547b0d6', 'https://static.inaturalist.org/photos/636593497/original.jpg', 0, '2026-03-18 22:46:06.903550');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'a6bb4e95-92e6-43df-b2b0-04b964df3111', '27d63740-1e4a-48cc-93ba-85488547b0d6', '208ce275-f84a-4a07-b254-1ac56ce149fb',
    (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
    NULL, TRUE, FALSE, '2026-03-18 23:13:06.903550', '2026-03-18 23:13:06.903550'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'b675f66d-77a7-487b-a949-4a1ffb670c33', '27d63740-1e4a-48cc-93ba-85488547b0d6', '19094605-71ab-468c-8f55-99140d2d1fb9',
    (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2026-03-20 04:13:06.903550', '2026-03-20 04:13:06.903550'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    '52e1d798-b030-469c-a9a6-086608496d63', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Observed a Phalacrocorax carbo near Istanbul.', '2025-06-18 01:51:06.903615',
    ST_SetSRID(ST_MakePoint(28.734226, 41.025507), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Phalacrocorax carbo' LIMIT 1),
    'NEEDS_ID', FALSE, '2025-06-18 01:51:06.903615', '2025-06-18 01:51:06.903615'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('44bb5347-d1cb-4c0b-b264-6baae1b69a33', '52e1d798-b030-469c-a9a6-086608496d63', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636546886/medium.jpg', 0, '2025-06-18 01:51:06.903615');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '124efe32-ae6e-4341-a0fd-ca2c9146939f', '52e1d798-b030-469c-a9a6-086608496d63', '19094605-71ab-468c-8f55-99140d2d1fb9',
    (SELECT id FROM taxa WHERE scientific_name = 'Phalacrocorax carbo' LIMIT 1),
    NULL, TRUE, FALSE, '2025-06-18 02:25:06.903615', '2025-06-18 02:25:06.903615'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'cad87113-4b92-42fe-9a4b-b3d0a06c3064', '52e1d798-b030-469c-a9a6-086608496d63', '16795721-9825-4046-bad9-70dd300a2e0f',
    (SELECT id FROM taxa WHERE scientific_name = 'Buteo buteo' LIMIT 1),
    'Looks more like a Buteo buteo to me.', TRUE, FALSE, '2025-06-18 06:25:06.903615', '2025-06-18 06:25:06.903615'
);

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
    'd24fb763-9a51-42fc-80bc-0e63d83dc65d', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Ciconia ciconia near Istanbul.', '2025-04-15 19:26:06.903681',
    ST_SetSRID(ST_MakePoint(28.883042, 41.182547), 4326), 'Istanbul, Turkey',
    (SELECT id FROM taxa WHERE scientific_name = 'Ciconia ciconia' LIMIT 1),
    'RESEARCH_GRADE', FALSE, '2025-04-15 19:26:06.903681', '2025-04-15 19:26:06.903681'
);

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('f93cd6f6-3ba4-4e0a-91c1-ca2ce5d6d116', 'd24fb763-9a51-42fc-80bc-0e63d83dc65d', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636543435/medium.jpg', 0, '2025-04-15 19:26:06.903681');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    '68cf8412-0ac6-4181-a921-5115c4137421', 'd24fb763-9a51-42fc-80bc-0e63d83dc65d', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
    (SELECT id FROM taxa WHERE scientific_name = 'Ciconia ciconia' LIMIT 1),
    NULL, TRUE, FALSE, '2025-04-15 19:32:06.903681', '2025-04-15 19:32:06.903681'
);

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
    'eb30fe70-99af-4afa-bc63-a0ae15d6e494', 'd24fb763-9a51-42fc-80bc-0e63d83dc65d', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
    (SELECT id FROM taxa WHERE scientific_name = 'Ciconia ciconia' LIMIT 1),
    'Agree with this ID.', TRUE, FALSE, '2025-04-16 03:32:06.903681', '2025-04-16 03:32:06.903681'
);

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('9aaef7fc-4b14-4e61-bd56-7a711bb79d35', 'd24fb763-9a51-42fc-80bc-0e63d83dc65d', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Wow, I have been looking for one of these.', FALSE, '2025-04-16 21:26:06.903681', '2025-04-16 21:26:06.903681');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '1ba82190-2e94-49eb-a47e-804869249353', '16795721-9825-4046-bad9-70dd300a2e0f', 'Observed a Corvus cornix near Istanbul.', '2026-04-01 03:26:06.903757',
           ST_SetSRID(ST_MakePoint(29.080172, 40.931954), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-04-01 03:26:06.903757', '2026-04-01 03:26:06.903757'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('01a4bc1d-402e-4d2a-a7c3-b51cf623bd3d', '1ba82190-2e94-49eb-a47e-804869249353', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636583335/original.jpg', 0, '2026-04-01 03:26:06.903757');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b0ae4487-93a5-4a19-8d3e-360d3290517b', '1ba82190-2e94-49eb-a47e-804869249353', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           NULL, TRUE, FALSE, '2026-04-01 04:15:06.903757', '2026-04-01 04:15:06.903757'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'a7244f1b-aa28-4482-83ae-e7f365fbfe4d', '1ba82190-2e94-49eb-a47e-804869249353', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-04-01 20:15:06.903757', '2026-04-01 20:15:06.903757'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '288eb111-c28b-48b3-9d6d-991d60418bd4', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Larus michahellis near Istanbul.', '2025-07-30 06:13:06.903817',
           ST_SetSRID(ST_MakePoint(28.999125, 40.996101), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Larus michahellis' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-07-30 06:13:06.903817', '2025-07-30 06:13:06.903817'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d76514b1-7b85-4f8e-b052-f72b9fcb2320', '288eb111-c28b-48b3-9d6d-991d60418bd4', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636542886/medium.jpg', 0, '2025-07-30 06:13:06.903817');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '26c166f0-1750-49ea-8fad-e6466e8b7251', '288eb111-c28b-48b3-9d6d-991d60418bd4', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Larus michahellis' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-30 06:58:06.903817', '2025-07-30 06:58:06.903817'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'a1adaf70-9c68-456a-abcc-36c59d76c10a', '288eb111-c28b-48b3-9d6d-991d60418bd4', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Larus michahellis' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-07-31 21:58:06.903817', '2025-07-31 21:58:06.903817'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '309e96b2-1d9f-430d-ba0f-b2626b6d6bcd', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', '', '2026-03-09 13:34:06.903876',
           ST_SetSRID(ST_MakePoint(28.732514, 41.224293), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-03-09 13:34:06.903876', '2026-03-09 13:34:06.903876'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('f2cead83-4da7-4af3-9300-c907be69fd76', '309e96b2-1d9f-430d-ba0f-b2626b6d6bcd', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636544301/medium.jpg', 0, '2026-03-09 13:34:06.903876');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '02ff2a23-053c-47be-8fcd-a71ad2dbbcac', '309e96b2-1d9f-430d-ba0f-b2626b6d6bcd', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           NULL, TRUE, FALSE, '2026-03-09 13:42:06.903876', '2026-03-09 13:42:06.903876'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'e4d62226-bc11-4040-9f50-d4553fc1ccf9', '309e96b2-1d9f-430d-ba0f-b2626b6d6bcd', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-03-10 00:42:06.903876', '2026-03-10 00:42:06.903876'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('444c3a14-4d0a-4d0c-923d-c2ec3c8de4ae', '309e96b2-1d9f-430d-ba0f-b2626b6d6bcd', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Are you sure about the ID?', FALSE, '2026-03-09 21:34:06.903876', '2026-03-09 21:34:06.903876');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '49786faf-3a60-4593-bf77-51a088d2f83a', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Observed a Accipiter nisus near Istanbul.', '2025-07-29 23:51:06.903952',
           ST_SetSRID(ST_MakePoint(29.051213, 41.07071), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-07-29 23:51:06.903952', '2025-07-29 23:51:06.903952'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('327524db-6135-45c4-b2f7-a2d57d15b342', '49786faf-3a60-4593-bf77-51a088d2f83a', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636986434/original.jpg', 0, '2025-07-29 23:51:06.903952');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '04943cd3-64a4-4980-a19c-e0397662ab83', '49786faf-3a60-4593-bf77-51a088d2f83a', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-30 00:37:06.903952', '2025-07-30 00:37:06.903952'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b1bd6f2c-9a39-4547-aa83-b2ebc967bc35', '49786faf-3a60-4593-bf77-51a088d2f83a', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-07-31 15:37:06.903952', '2025-07-31 15:37:06.903952'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'dad3afb8-33e0-4ff9-8133-22b5175c5d02', '208ce275-f84a-4a07-b254-1ac56ce149fb', '', '2025-08-04 11:55:06.904013',
           ST_SetSRID(ST_MakePoint(28.850663, 41.037551), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-08-04 11:55:06.904013', '2025-08-04 11:55:06.904013'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d75e12e1-06b0-4774-9f82-f1787cf474b2', 'dad3afb8-33e0-4ff9-8133-22b5175c5d02', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636549651/original.jpg', 0, '2025-08-04 11:55:06.904013');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'f6b32826-b533-476c-bdbc-c7a8ee74f61b', 'dad3afb8-33e0-4ff9-8133-22b5175c5d02', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-04 12:31:06.904013', '2025-08-04 12:31:06.904013'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '4338d547-d8f5-48de-875e-2d8a064289ee', 'dad3afb8-33e0-4ff9-8133-22b5175c5d02', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-08-05 12:31:06.904013', '2025-08-05 12:31:06.904013'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '442d319e-851f-446c-adb6-9eb41f5ac2aa', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8', 'Observed a Chroicocephalus ridibundus near Istanbul.', '2025-10-30 15:21:06.904069',
           ST_SetSRID(ST_MakePoint(29.17138, 41.119338), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-30 15:21:06.904069', '2025-10-30 15:21:06.904069'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('2b5f4789-d1ad-493a-8b30-6292f06cc364', '442d319e-851f-446c-adb6-9eb41f5ac2aa', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636595776/original.jpg', 0, '2025-10-30 15:21:06.904069');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '38480da5-655c-4c2f-9721-875c4535d3e8', '442d319e-851f-446c-adb6-9eb41f5ac2aa', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-30 15:44:06.904069', '2025-10-30 15:44:06.904069'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '1aaa3b42-481f-45c8-9c59-55a835a1600a', '442d319e-851f-446c-adb6-9eb41f5ac2aa', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-31 05:44:06.904069', '2025-10-31 05:44:06.904069'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('12ceb512-e408-425e-8836-e096a5019b92', '442d319e-851f-446c-adb6-9eb41f5ac2aa', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Nice catch by the Bosphorus.', FALSE, '2025-10-31 12:21:06.904069', '2025-10-31 12:21:06.904069');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '1582c112-4d70-4622-806f-43e9a4f611ac', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Observed a Pica pica near Istanbul.', '2025-11-01 05:42:06.904140',
           ST_SetSRID(ST_MakePoint(29.13754, 41.06491), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-11-01 05:42:06.904140', '2025-11-01 05:42:06.904140'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('6a2c9cbb-373d-4ed4-9ed3-0b1d83af914b', '1582c112-4d70-4622-806f-43e9a4f611ac', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636598378/original.jpg', 0, '2025-11-01 05:42:06.904140');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '1b2db5bd-698d-487b-9a9e-5ee258f85549', '1582c112-4d70-4622-806f-43e9a4f611ac', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Pica pica' LIMIT 1),
           NULL, TRUE, FALSE, '2025-11-01 06:42:06.904140', '2025-11-01 06:42:06.904140'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '32a471ca-e466-4e42-9da7-574ba62eb24f', '1582c112-4d70-4622-806f-43e9a4f611ac', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
           'Looks more like a Spilopelia senegalensis to me.', TRUE, FALSE, '2025-11-02 03:42:06.904140', '2025-11-02 03:42:06.904140'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('6018e41f-1745-4b53-8207-94357509d279', '1582c112-4d70-4622-806f-43e9a4f611ac', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Nice catch by the Bosphorus.', FALSE, '2025-11-02 18:42:06.904140', '2025-11-02 18:42:06.904140');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'be02b658-66ea-4f56-aa13-94cd08e89e61', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Garrulus glandarius near Istanbul.', '2025-10-23 04:02:06.904214',
           ST_SetSRID(ST_MakePoint(28.836353, 41.221623), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Garrulus glandarius' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-23 04:02:06.904214', '2025-10-23 04:02:06.904214'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('470ebd6f-ead2-47a1-9e8b-16bac0fd3d19', 'be02b658-66ea-4f56-aa13-94cd08e89e61', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636523609/medium.jpg', 0, '2025-10-23 04:02:06.904214');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '90866317-9d99-41ba-a5fa-944ae4951917', 'be02b658-66ea-4f56-aa13-94cd08e89e61', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Garrulus glandarius' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-23 04:17:06.904214', '2025-10-23 04:17:06.904214'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'c96b61be-58e5-48d2-9d3e-5c7fed98c7c7', 'be02b658-66ea-4f56-aa13-94cd08e89e61', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Garrulus glandarius' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-23 13:17:06.904214', '2025-10-23 13:17:06.904214'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '7c0c380b-7b58-4fc4-9edc-af166046452e', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8', 'Observed a Erithacus rubecula near Istanbul.', '2025-07-11 05:54:06.904272',
           ST_SetSRID(ST_MakePoint(28.696218, 41.015739), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-07-11 05:54:06.904272', '2025-07-11 05:54:06.904272'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('00e54075-9f00-4664-98b0-ddebec419cfc', '7c0c380b-7b58-4fc4-9edc-af166046452e', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636595151/original.jpg', 0, '2025-07-11 05:54:06.904272');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '3c70c0cd-7b85-47d3-baff-efc299d0aa83', '7c0c380b-7b58-4fc4-9edc-af166046452e', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-11 06:15:06.904272', '2025-07-11 06:15:06.904272'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'f555867a-ed64-4c58-83c1-0e29aca9dd8c', '16795721-9825-4046-bad9-70dd300a2e0f', 'Observed a Hirundo rustica near Istanbul.', '2025-10-30 13:20:06.904317',
           ST_SetSRID(ST_MakePoint(29.277019, 40.93349), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-30 13:20:06.904317', '2025-10-30 13:20:06.904317'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('10d50ecb-3b73-4372-a309-4693fe6cdffa', 'f555867a-ed64-4c58-83c1-0e29aca9dd8c', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636550106/medium.jpg', 0, '2025-10-30 13:20:06.904317');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '477441fa-77ea-43b7-a45b-998bfc3850b0', 'f555867a-ed64-4c58-83c1-0e29aca9dd8c', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-30 13:45:06.904317', '2025-10-30 13:45:06.904317'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'db498bd8-e865-494c-9608-5948841b6469', 'f555867a-ed64-4c58-83c1-0e29aca9dd8c', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-31 06:45:06.904317', '2025-10-31 06:45:06.904317'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '145dc2be-8192-432e-9e13-55b1d7107fbb', '1e78be55-8ee1-41a5-bea3-7ce19037d064', '', '2025-05-03 14:27:06.904375',
           ST_SetSRID(ST_MakePoint(28.742456, 40.965491), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Columba livia' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-05-03 14:27:06.904375', '2025-05-03 14:27:06.904375'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('1ad5575a-2f48-488d-a6ca-6dcc740744ae', '145dc2be-8192-432e-9e13-55b1d7107fbb', 'https://static.inaturalist.org/photos/636598738/original.jpg', 0, '2025-05-03 14:27:06.904375');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '83475c5d-3415-47af-baa5-0bb696cf3cda', '145dc2be-8192-432e-9e13-55b1d7107fbb', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Columba livia' LIMIT 1),
           NULL, TRUE, FALSE, '2025-05-03 15:00:06.904375', '2025-05-03 15:00:06.904375'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7414297e-4571-4192-8683-ba517a3b8875', '145dc2be-8192-432e-9e13-55b1d7107fbb', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Columba livia' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-05-05 12:00:06.904375', '2025-05-05 12:00:06.904375'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '1c5a2bde-7153-4a8c-90fd-b0ae1888f82f', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', '', '2025-05-05 03:58:06.904433',
           ST_SetSRID(ST_MakePoint(28.769575, 40.913066), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Cyanistes caeruleus' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-05-05 03:58:06.904433', '2025-05-05 03:58:06.904433'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e98ed4fe-201a-443d-bcd1-148ceeb9b920', '1c5a2bde-7153-4a8c-90fd-b0ae1888f82f', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636997248/original.jpg', 0, '2025-05-05 03:58:06.904433');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7f354e7e-efc3-4951-9ec7-e301ea6fcb28', '1c5a2bde-7153-4a8c-90fd-b0ae1888f82f', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Cyanistes caeruleus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-05-05 04:20:06.904433', '2025-05-05 04:20:06.904433'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '64adcba0-d9ec-4e54-a674-cb9a47b1a4b3', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Fringilla coelebs near Istanbul.', '2025-04-12 08:13:06.904477',
           ST_SetSRID(ST_MakePoint(28.891435, 40.997899), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-04-12 08:13:06.904477', '2025-04-12 08:13:06.904477'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e9f836bc-6a7d-42ef-94d1-0dc3f13e8465', '64adcba0-d9ec-4e54-a674-cb9a47b1a4b3', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636554782/medium.jpg', 0, '2025-04-12 08:13:06.904477');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'fd9ae43a-f437-45d9-a8a2-566946959ebe', '64adcba0-d9ec-4e54-a674-cb9a47b1a4b3', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           NULL, TRUE, FALSE, '2025-04-12 08:48:06.904477', '2025-04-12 08:48:06.904477'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '789027df-5d81-4a9c-a894-b962bf83b92f', '64adcba0-d9ec-4e54-a674-cb9a47b1a4b3', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-04-13 08:48:06.904477', '2025-04-13 08:48:06.904477'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '447c3d32-eb41-4eb0-b78e-ca45e8cd4256', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Observed a Streptopelia decaocto near Istanbul.', '2026-01-08 09:42:06.904554',
           ST_SetSRID(ST_MakePoint(28.915364, 41.160279), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Streptopelia decaocto' LIMIT 1),
           'NEEDS_ID', FALSE, '2026-01-08 09:42:06.904554', '2026-01-08 09:42:06.904554'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('4684b5a4-901b-4b8d-8c67-57e0ba4705ee', '447c3d32-eb41-4eb0-b78e-ca45e8cd4256', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636382733/original.jpg', 0, '2026-01-08 09:42:06.904554');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '9854151f-7beb-4fa4-bc33-a7c101c35a19', '447c3d32-eb41-4eb0-b78e-ca45e8cd4256', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Streptopelia decaocto' LIMIT 1),
           NULL, TRUE, FALSE, '2026-01-08 10:01:06.904554', '2026-01-08 10:01:06.904554'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('9bdb7432-3019-4088-8f6f-a1a860754a72', '447c3d32-eb41-4eb0-b78e-ca45e8cd4256', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Great find for this time of year.', FALSE, '2026-01-08 20:42:06.904554', '2026-01-08 20:42:06.904554');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'aa15696e-5895-4096-b7e2-05515cb1f92c', '214797bd-8eb5-4d1b-b339-219fda0374d8', '', '2025-08-11 22:49:06.904613',
           ST_SetSRID(ST_MakePoint(28.729578, 41.013673), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-08-11 22:49:06.904613', '2025-08-11 22:49:06.904613'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('bd703943-1f7b-4fcd-86f3-81f4e11ebd17', 'aa15696e-5895-4096-b7e2-05515cb1f92c', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636988113/original.jpg', 0, '2025-08-11 22:49:06.904613');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b8165fdf-8273-49af-97f7-8a63dc8d5219', 'aa15696e-5895-4096-b7e2-05515cb1f92c', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-11 22:55:06.904613', '2025-08-11 22:55:06.904613'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '07e98791-d10b-4797-841a-7653cc963428', 'aa15696e-5895-4096-b7e2-05515cb1f92c', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-08-13 17:55:06.904613', '2025-08-13 17:55:06.904613'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'c5ec171e-e7b0-49bf-b79f-4fcbd1a39d15', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8', 'Observed a Fringilla coelebs near Istanbul.', '2025-10-10 10:38:06.904670',
           ST_SetSRID(ST_MakePoint(28.829082, 41.042502), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-10-10 10:38:06.904670', '2025-10-10 10:38:06.904670'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('db829703-d33c-4055-b1d6-461b61c21ad3', 'c5ec171e-e7b0-49bf-b79f-4fcbd1a39d15', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636554782/medium.jpg', 0, '2025-10-10 10:38:06.904670');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'a81e8431-2bf0-4105-ac0a-5dc56f41ed07', 'c5ec171e-e7b0-49bf-b79f-4fcbd1a39d15', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-10 11:08:06.904670', '2025-10-10 11:08:06.904670'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '49ef514f-36e7-4a76-a325-66d40b8bbf05', 'c5ec171e-e7b0-49bf-b79f-4fcbd1a39d15', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-10-12 04:08:06.904670', '2025-10-12 04:08:06.904670'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('12c44ad6-f489-4bdb-855e-0b1b4ab4bf2a', 'c5ec171e-e7b0-49bf-b79f-4fcbd1a39d15', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'I saw one of these in Kadıköy yesterday.', FALSE, '2025-10-11 15:38:06.904670', '2025-10-11 15:38:06.904670');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '724647ad-ce7e-4fc6-a37f-d14b3b8ba4ff', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Observed a Microcarbo pygmaeus near Istanbul.', '2025-07-06 04:28:06.904740',
           ST_SetSRID(ST_MakePoint(28.824754, 41.235312), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Microcarbo pygmaeus' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-07-06 04:28:06.904740', '2025-07-06 04:28:06.904740'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('2b305c48-4713-40cb-90a8-fcc14eca38ad', '724647ad-ce7e-4fc6-a37f-d14b3b8ba4ff', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636451173/medium.jpg', 0, '2025-07-06 04:28:06.904740');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '13fa40fd-a694-47ab-ba26-e5774539bdde', '724647ad-ce7e-4fc6-a37f-d14b3b8ba4ff', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Microcarbo pygmaeus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-06 05:13:06.904740', '2025-07-06 05:13:06.904740'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'be2b6e14-8321-4ad9-aa8b-ab87a1e3f2cf', '724647ad-ce7e-4fc6-a37f-d14b3b8ba4ff', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
           'Looks more like a Ardea cinerea to me.', TRUE, FALSE, '2025-07-06 14:13:06.904740', '2025-07-06 14:13:06.904740'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'd0b25139-520f-4a16-93f8-22445d65003d', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Observed a Coloeus monedula near Istanbul.', '2025-08-18 09:55:06.904802',
           ST_SetSRID(ST_MakePoint(29.17024, 41.224088), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-08-18 09:55:06.904802', '2025-08-18 09:55:06.904802'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('b9811288-a009-4d74-940c-925a41a5c9d2', 'd0b25139-520f-4a16-93f8-22445d65003d', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636563230/original.jpg', 0, '2025-08-18 09:55:06.904802');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7d8c99ac-9094-4d1e-91c5-40be620452f9', 'd0b25139-520f-4a16-93f8-22445d65003d', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-18 10:18:06.904802', '2025-08-18 10:18:06.904802'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'bf94bfcb-0595-4a05-9bbe-47e18278adaa', 'd0b25139-520f-4a16-93f8-22445d65003d', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-08-20 09:18:06.904802', '2025-08-20 09:18:06.904802'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'b7cd59ba-2036-4f82-b1b9-1582a7ce5549', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Observed a Erithacus rubecula near Istanbul.', '2025-06-23 15:47:06.904859',
           ST_SetSRID(ST_MakePoint(29.261189, 41.164649), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-06-23 15:47:06.904859', '2025-06-23 15:47:06.904859'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('ba594b48-f06c-47f7-9e0e-306883211f2c', 'b7cd59ba-2036-4f82-b1b9-1582a7ce5549', 'https://static.inaturalist.org/photos/636575452/original.jpg', 0, '2025-06-23 15:47:06.904859');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '2db3b13f-e444-45f9-818a-163c75c08bdf', 'b7cd59ba-2036-4f82-b1b9-1582a7ce5549', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-06-23 15:58:06.904859', '2025-06-23 15:58:06.904859'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '3eeba084-5580-4307-906f-d2cc868be7b8', 'b7cd59ba-2036-4f82-b1b9-1582a7ce5549', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           'Looks more like a Sturnus vulgaris to me.', TRUE, FALSE, '2025-06-24 16:58:06.904859', '2025-06-24 16:58:06.904859'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'e641eb61-9905-43af-ace8-0a832885ed65', 'ca8d3847-cbda-4610-a92f-a3045f4c2157', 'Observed a Chroicocephalus ridibundus near Istanbul.', '2025-12-23 14:25:06.904915',
           ST_SetSRID(ST_MakePoint(28.640952, 41.233231), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-12-23 14:25:06.904915', '2025-12-23 14:25:06.904915'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('28e087b1-784b-438b-b750-ded593b3ad5e', 'e641eb61-9905-43af-ace8-0a832885ed65', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636564958/original.jpg', 0, '2025-12-23 14:25:06.904915');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '9a40e6b1-5ec8-4a22-a45d-7f9344cd0d3d', 'e641eb61-9905-43af-ace8-0a832885ed65', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Chroicocephalus ridibundus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-12-23 14:33:06.904915', '2025-12-23 14:33:06.904915'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '6e7facf7-a07f-46b6-a6c7-46cf03279960', 'e641eb61-9905-43af-ace8-0a832885ed65', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'Looks more like a Parus major to me.', TRUE, FALSE, '2025-12-24 22:33:06.904915', '2025-12-24 22:33:06.904915'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'd938a6ed-e8e1-469a-81ae-ca14514f8f4b', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Observed a Coloeus monedula near Istanbul.', '2026-03-31 17:42:06.904974',
           ST_SetSRID(ST_MakePoint(28.64579, 41.00854), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'NEEDS_ID', FALSE, '2026-03-31 17:42:06.904974', '2026-03-31 17:42:06.904974'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a8d4fe8a-7862-4d98-9fe8-393428a65609', 'd938a6ed-e8e1-469a-81ae-ca14514f8f4b', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636603766/original.jpg', 0, '2026-03-31 17:42:06.904974');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'f337094f-e51f-45c8-b2e1-d4598c9f56c2', 'd938a6ed-e8e1-469a-81ae-ca14514f8f4b', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           NULL, TRUE, FALSE, '2026-03-31 18:00:06.904974', '2026-03-31 18:00:06.904974'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('07f1223a-e3b6-4823-a135-0c5424465bb7', 'd938a6ed-e8e1-469a-81ae-ca14514f8f4b', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Nice catch by the Bosphorus.', FALSE, '2026-04-02 18:42:06.904974', '2026-04-02 18:42:06.904974');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'bd5cee1a-e2cf-4674-ab22-47bc0f6da027', 'bbacde32-2240-4239-b84b-759b431c6c7f', '', '2026-02-24 14:18:06.905030',
           ST_SetSRID(ST_MakePoint(28.768794, 41.011379), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-02-24 14:18:06.905030', '2026-02-24 14:18:06.905030'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('fc15ff93-655c-4b33-b201-3422eecc90b6', 'bd5cee1a-e2cf-4674-ab22-47bc0f6da027', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636546942/medium.jpg', 0, '2026-02-24 14:18:06.905030');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '4289c543-971d-431f-867d-f4def3a60daa', 'bd5cee1a-e2cf-4674-ab22-47bc0f6da027', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-24 14:55:06.905030', '2026-02-24 14:55:06.905030'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '75e8293d-6dc0-4dfa-8eb3-a41c789e14af', 'bd5cee1a-e2cf-4674-ab22-47bc0f6da027', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Ardea cinerea' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-24 16:55:06.905030', '2026-02-24 16:55:06.905030'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '7849fc38-42f3-4503-a90e-b966b7a7f731', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Coloeus monedula near Istanbul.', '2025-07-20 01:11:06.905083',
           ST_SetSRID(ST_MakePoint(29.277225, 41.10194), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-07-20 01:11:06.905083', '2025-07-20 01:11:06.905083'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('1eb6ba14-fcc4-4895-8ace-131b75236074', '7849fc38-42f3-4503-a90e-b966b7a7f731', 'https://static.inaturalist.org/photos/636542292/medium.jpg', 0, '2025-07-20 01:11:06.905083');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '160daab2-9194-4b27-918d-f6628f0c7f66', '7849fc38-42f3-4503-a90e-b966b7a7f731', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-20 01:25:06.905083', '2025-07-20 01:25:06.905083'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'c60c0053-4bbb-4740-bb8a-86cdf25dafb3', '7849fc38-42f3-4503-a90e-b966b7a7f731', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-07-21 15:25:06.905083', '2025-07-21 15:25:06.905083'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '18d095f4-3a0b-48c3-b073-a5ded4958e97', '16795721-9825-4046-bad9-70dd300a2e0f', 'Observed a Corvus cornix near Istanbul.', '2026-01-31 20:06:06.905137',
           ST_SetSRID(ST_MakePoint(28.908025, 41.136667), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-01-31 20:06:06.905137', '2026-01-31 20:06:06.905137'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('c05383b7-c2e6-4997-bb61-146117c9104f', '18d095f4-3a0b-48c3-b073-a5ded4958e97', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636562167/original.jpg', 0, '2026-01-31 20:06:06.905137');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '9bc73cbe-909c-42de-929a-4069d023a371', '18d095f4-3a0b-48c3-b073-a5ded4958e97', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           NULL, TRUE, FALSE, '2026-01-31 20:44:06.905137', '2026-01-31 20:44:06.905137'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '67fff284-b0b7-4606-9a10-52189faa63a9', '18d095f4-3a0b-48c3-b073-a5ded4958e97', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-01 04:44:06.905137', '2026-02-01 04:44:06.905137'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '6aa7de6a-5885-4c5e-bfd2-0cf64e67a99e', '214797bd-8eb5-4d1b-b339-219fda0374d8', 'Observed a Motacilla alba near Istanbul.', '2026-02-02 11:19:06.905191',
           ST_SetSRID(ST_MakePoint(29.329426, 40.966262), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'NEEDS_ID', FALSE, '2026-02-02 11:19:06.905191', '2026-02-02 11:19:06.905191'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('70ab4257-ddf2-446d-8b86-b09e77613f90', '6aa7de6a-5885-4c5e-bfd2-0cf64e67a99e', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636549367/medium.jpg', 0, '2026-02-02 11:19:06.905191');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '553b478a-c2ec-413e-b21a-1de4d9031cce', '6aa7de6a-5885-4c5e-bfd2-0cf64e67a99e', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-02 11:39:06.905191', '2026-02-02 11:39:06.905191'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '78dc9f24-243d-436c-9e70-0efac3750c14', '6aa7de6a-5885-4c5e-bfd2-0cf64e67a99e', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           'Looks more like a Accipiter nisus to me.', TRUE, FALSE, '2026-02-03 13:39:06.905191', '2026-02-03 13:39:06.905191'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('2c838270-95cf-442e-8e8b-62f6045e7aa3', '6aa7de6a-5885-4c5e-bfd2-0cf64e67a99e', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Amazing sighting!', FALSE, '2026-02-04 18:19:06.905191', '2026-02-04 18:19:06.905191');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '2dbad225-d637-49cc-9aa3-4be530c7fd5b', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', '', '2025-08-05 21:43:06.905262',
           ST_SetSRID(ST_MakePoint(28.644274, 40.875008), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-08-05 21:43:06.905262', '2025-08-05 21:43:06.905262'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('e7227098-549b-46f2-8b53-b249fd1828eb', '2dbad225-d637-49cc-9aa3-4be530c7fd5b', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636609352/original.jpg', 0, '2025-08-05 21:43:06.905262');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '55fb8bad-90b4-4fe5-b476-88a7c3ad5f36', '2dbad225-d637-49cc-9aa3-4be530c7fd5b', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-05 21:59:06.905262', '2025-08-05 21:59:06.905262'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '2acbf7d3-a87c-4900-bf0a-aeb186ec2c6b', '2dbad225-d637-49cc-9aa3-4be530c7fd5b', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-08-06 15:59:06.905262', '2025-08-06 15:59:06.905262'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '0d9595bb-519b-4513-ab79-33d71081d8df', '7ab7516d-e659-418d-b8af-977f7c49c12b', '', '2025-06-12 09:19:06.905315',
           ST_SetSRID(ST_MakePoint(28.728929, 41.199873), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-06-12 09:19:06.905315', '2025-06-12 09:19:06.905315'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('8b7c390e-d24f-45f6-aca0-41bd5417f47f', '0d9595bb-519b-4513-ab79-33d71081d8df', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636789053/original.jpg', 0, '2025-06-12 09:19:06.905315');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'd2baaf9c-ebe1-4fd2-95a8-d0f515364fc9', '0d9595bb-519b-4513-ab79-33d71081d8df', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           NULL, TRUE, FALSE, '2025-06-12 09:45:06.905315', '2025-06-12 09:45:06.905315'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '5c485f5f-f3dc-4834-a97c-d19d46becdf7', '0d9595bb-519b-4513-ab79-33d71081d8df', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-06-14 07:45:06.905315', '2025-06-14 07:45:06.905315'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '5e7dfa88-4f21-4bd5-a53c-84dd51465bb8', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Observed a Parus major near Istanbul.', '2025-06-02 02:25:06.905370',
           ST_SetSRID(ST_MakePoint(29.063606, 41.03799), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-06-02 02:25:06.905370', '2025-06-02 02:25:06.905370'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('3017e36d-a84a-4e6a-914d-af7b1b14d159', '5e7dfa88-4f21-4bd5-a53c-84dd51465bb8', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636965870/original.jpg', 0, '2025-06-02 02:25:06.905370');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '255f1ba7-cba0-4649-be02-4d35c06eec4c', '5e7dfa88-4f21-4bd5-a53c-84dd51465bb8', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           NULL, TRUE, FALSE, '2025-06-02 02:53:06.905370', '2025-06-02 02:53:06.905370'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '345f6b27-7546-47fa-b69b-01ee8ab1c445', '5e7dfa88-4f21-4bd5-a53c-84dd51465bb8', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-06-02 09:53:06.905370', '2025-06-02 09:53:06.905370'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'a128511d-f57e-4d7d-82f7-bcced04cb9c6', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2025-06-13 04:09:06.905425',
           ST_SetSRID(ST_MakePoint(29.211599, 40.958465), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-06-13 04:09:06.905425', '2025-06-13 04:09:06.905425'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('a32ab407-ff7b-4ebd-b889-7306cc5df7f5', 'a128511d-f57e-4d7d-82f7-bcced04cb9c6', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636614307/original.jpg', 0, '2025-06-13 04:09:06.905425');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '9f091c18-153c-425a-af22-5e1d556d6398', 'a128511d-f57e-4d7d-82f7-bcced04cb9c6', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Anas platyrhynchos' LIMIT 1),
           NULL, TRUE, FALSE, '2025-06-13 04:35:06.905425', '2025-06-13 04:35:06.905425'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('bf242727-3aba-44ce-904a-8190b353c4ae', 'a128511d-f57e-4d7d-82f7-bcced04cb9c6', '16795721-9825-4046-bad9-70dd300a2e0f', 'Great find for this time of year.', FALSE, '2025-06-14 17:09:06.905425', '2025-06-14 17:09:06.905425');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '959482ca-fe4f-4893-976f-1bb41d7b1a71', '7ab7516d-e659-418d-b8af-977f7c49c12b', 'Observed a Sturnus vulgaris near Istanbul.', '2025-12-27 21:03:06.905479',
           ST_SetSRID(ST_MakePoint(28.751735, 41.24206), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-12-27 21:03:06.905479', '2025-12-27 21:03:06.905479'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('6522cb64-0068-4383-a8f3-a1d816309ccb', '959482ca-fe4f-4893-976f-1bb41d7b1a71', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636595138/original.jpg', 0, '2025-12-27 21:03:06.905479');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '5b5a6842-99c0-4188-a174-791b5e94d132', '959482ca-fe4f-4893-976f-1bb41d7b1a71', '7ab7516d-e659-418d-b8af-977f7c49c12b',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           NULL, TRUE, FALSE, '2025-12-27 22:03:06.905479', '2025-12-27 22:03:06.905479'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '390a18bb-709e-4ee7-addf-d7b27396dd4c', '959482ca-fe4f-4893-976f-1bb41d7b1a71', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Sturnus vulgaris' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-12-29 16:03:06.905479', '2025-12-29 16:03:06.905479'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '11566d20-5ce5-46c0-9d7d-e0adaff67503', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Motacilla alba near Istanbul.', '2026-02-03 03:15:06.905532',
           ST_SetSRID(ST_MakePoint(28.769696, 41.168539), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'NEEDS_ID', FALSE, '2026-02-03 03:15:06.905532', '2026-02-03 03:15:06.905532'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d5aefc71-81b1-43e1-94ad-d8bfcba86b5d', '11566d20-5ce5-46c0-9d7d-e0adaff67503', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636598556/original.jpg', 0, '2026-02-03 03:15:06.905532');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '89d45208-61be-46e6-9342-fc33e63abe18', '11566d20-5ce5-46c0-9d7d-e0adaff67503', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-03 03:34:06.905532', '2026-02-03 03:34:06.905532'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '62cbab73-9b7b-4a0a-883f-6adfbace7c25', '11566d20-5ce5-46c0-9d7d-e0adaff67503', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Coloeus monedula' LIMIT 1),
           'Looks more like a Coloeus monedula to me.', TRUE, FALSE, '2026-02-03 04:34:06.905532', '2026-02-03 04:34:06.905532'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('84cb75a2-8670-4a47-88ad-16d60964c62b', '11566d20-5ce5-46c0-9d7d-e0adaff67503', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Beautiful bird, nice photo.', FALSE, '2026-02-04 12:15:06.905532', '2026-02-04 12:15:06.905532');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '0c6e7950-2180-4e1a-bcbe-759fd6d2808f', 'bbacde32-2240-4239-b84b-759b431c6c7f', '', '2026-02-17 13:17:06.905601',
           ST_SetSRID(ST_MakePoint(29.091252, 40.862727), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-02-17 13:17:06.905601', '2026-02-17 13:17:06.905601'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('34b339d4-1c52-4cc6-a132-f3090a68c65b', '0c6e7950-2180-4e1a-bcbe-759fd6d2808f', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636544254/medium.jpg', 0, '2026-02-17 13:17:06.905601');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '38299b76-d2e4-4ae6-8d8f-efea1d0c6fa7', '0c6e7950-2180-4e1a-bcbe-759fd6d2808f', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-17 13:46:06.905601', '2026-02-17 13:46:06.905601'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '5bfaf912-da90-4931-b2e7-3516f68d9efa', '0c6e7950-2180-4e1a-bcbe-759fd6d2808f', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Turdus merula' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-19 04:46:06.905601', '2026-02-19 04:46:06.905601'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'ea48b822-b057-48c3-bb85-809268d45761', '214797bd-8eb5-4d1b-b339-219fda0374d8', 'Observed a Corvus cornix near Istanbul.', '2025-07-17 15:39:06.905654',
           ST_SetSRID(ST_MakePoint(29.170668, 41.196665), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-07-17 15:39:06.905654', '2025-07-17 15:39:06.905654'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('80d994f1-de7d-4744-b89b-cf358087f089', 'ea48b822-b057-48c3-bb85-809268d45761', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636543194/original.jpg', 0, '2025-07-17 15:39:06.905654');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '8aafdb6e-284d-4266-9b9b-b14d6005c07e', 'ea48b822-b057-48c3-bb85-809268d45761', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           NULL, TRUE, FALSE, '2025-07-17 16:24:06.905654', '2025-07-17 16:24:06.905654'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'ee690223-b558-420a-9db3-546650cfd13c', 'ea48b822-b057-48c3-bb85-809268d45761', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Corvus cornix' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-07-18 14:24:06.905654', '2025-07-18 14:24:06.905654'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('3c9a47f5-fc6f-4a5a-809d-6c40177cb30d', 'ea48b822-b057-48c3-bb85-809268d45761', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8', 'Great find for this time of year.', FALSE, '2025-07-20 05:39:06.905654', '2025-07-20 05:39:06.905654');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '3f161425-8883-4e93-9fb6-d1b7473021b3', '16795721-9825-4046-bad9-70dd300a2e0f', 'Observed a Accipiter nisus near Istanbul.', '2025-04-11 09:02:06.905720',
           ST_SetSRID(ST_MakePoint(28.651402, 41.042142), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-04-11 09:02:06.905720', '2025-04-11 09:02:06.905720'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('46e80fe6-5e45-415b-a325-37fa8d933e90', '3f161425-8883-4e93-9fb6-d1b7473021b3', 'https://static.inaturalist.org/photos/636542637/medium.jpg', 0, '2025-04-11 09:02:06.905720');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '9c5d1013-68f6-4746-a6e5-be1f49987755', '3f161425-8883-4e93-9fb6-d1b7473021b3', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           NULL, TRUE, FALSE, '2025-04-11 09:31:06.905720', '2025-04-11 09:31:06.905720'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '46a7c375-e3ec-498d-911a-3031e79a9489', '3f161425-8883-4e93-9fb6-d1b7473021b3', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Accipiter nisus' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-04-11 15:31:06.905720', '2025-04-11 15:31:06.905720'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('37925eaf-5b4a-4482-a5da-87fd688ca845', '3f161425-8883-4e93-9fb6-d1b7473021b3', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Nice catch by the Bosphorus.', FALSE, '2025-04-12 00:02:06.905720', '2025-04-12 00:02:06.905720');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '0e2b95a4-1623-4d4f-a04a-4dd8f2b28f84', '208ce275-f84a-4a07-b254-1ac56ce149fb', 'Observed a Columba livia near Istanbul.', '2025-10-10 19:53:06.905784',
           ST_SetSRID(ST_MakePoint(28.829719, 41.240371), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Columba livia' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-10-10 19:53:06.905784', '2025-10-10 19:53:06.905784'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d94e962e-fc06-4c48-8406-621b6138877c', '0e2b95a4-1623-4d4f-a04a-4dd8f2b28f84', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636549375/medium.jpg', 0, '2025-10-10 19:53:06.905784');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '59c4554d-f9bb-4099-bf5a-1cd8b79e917d', '0e2b95a4-1623-4d4f-a04a-4dd8f2b28f84', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Columba livia' LIMIT 1),
           NULL, TRUE, FALSE, '2025-10-10 20:31:06.905784', '2025-10-10 20:31:06.905784'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '5fc695a5-6aa0-4f0d-9aa1-46d2159eac22', '0e2b95a4-1623-4d4f-a04a-4dd8f2b28f84', 'ca8d3847-cbda-4610-a92f-a3045f4c2157',
           (SELECT id FROM taxa WHERE scientific_name = 'Hirundo rustica' LIMIT 1),
           'Looks more like a Hirundo rustica to me.', TRUE, FALSE, '2025-10-12 18:31:06.905784', '2025-10-12 18:31:06.905784'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('3a411a94-e22d-4921-803c-5fc3e158014d', '0e2b95a4-1623-4d4f-a04a-4dd8f2b28f84', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Confirmed, unmistakable pattern.', FALSE, '2025-10-12 19:53:06.905784', '2025-10-12 19:53:06.905784');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'c37bf1ab-64d6-4905-9492-ac12d1f8d3c9', '19094605-71ab-468c-8f55-99140d2d1fb9', '', '2025-05-12 02:08:06.905859',
           ST_SetSRID(ST_MakePoint(28.852134, 41.207065), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-05-12 02:08:06.905859', '2025-05-12 02:08:06.905859'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('599eaba3-1f28-4044-b419-8ce7e93f7c7c', 'c37bf1ab-64d6-4905-9492-ac12d1f8d3c9', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636554782/medium.jpg', 0, '2025-05-12 02:08:06.905859');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'd67b6b1b-1930-41c7-a589-23db1db0ec8f', 'c37bf1ab-64d6-4905-9492-ac12d1f8d3c9', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Fringilla coelebs' LIMIT 1),
           NULL, TRUE, FALSE, '2025-05-12 03:08:06.905859', '2025-05-12 03:08:06.905859'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '425df446-88f0-4467-9661-232e1d6f1d9d', 'c37bf1ab-64d6-4905-9492-ac12d1f8d3c9', '9835df77-6efd-4c5e-8697-cc1a95674eb6',
           (SELECT id FROM taxa WHERE scientific_name = 'Erithacus rubecula' LIMIT 1),
           'Looks more like a Erithacus rubecula to me.', TRUE, FALSE, '2025-05-13 20:08:06.905859', '2025-05-13 20:08:06.905859'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '618e01ff-d7e5-4ff1-b8c2-4cce224118da', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8', 'Observed a Tachymarptis melba near Istanbul.', '2026-04-02 06:19:06.905915',
           ST_SetSRID(ST_MakePoint(28.60795, 41.081072), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           'NEEDS_ID', FALSE, '2026-04-02 06:19:06.905915', '2026-04-02 06:19:06.905915'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d2b5b814-eea6-4648-95ff-3a7268885726', '618e01ff-d7e5-4ff1-b8c2-4cce224118da', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636590899/original.jpg', 0, '2026-04-02 06:19:06.905915');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'b6d1b33a-acf2-40ad-84f5-5ecb42cfdb3f', '618e01ff-d7e5-4ff1-b8c2-4cce224118da', 'fb1aa4df-458a-4aa4-9a1b-d824af8639a8',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           NULL, TRUE, FALSE, '2026-04-02 06:33:06.905915', '2026-04-02 06:33:06.905915'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'a9cd2072-a76e-498d-abb6-96bc9f52ceb8', '208ce275-f84a-4a07-b254-1ac56ce149fb', '', '2025-05-28 08:12:06.905960',
           ST_SetSRID(ST_MakePoint(28.898047, 40.866501), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-05-28 08:12:06.905960', '2025-05-28 08:12:06.905960'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d141a7cd-95ec-4bba-bfa7-dfcda5243165', 'a9cd2072-a76e-498d-abb6-96bc9f52ceb8', 'https://inaturalist-open-data.s3.amazonaws.com/photos/635210822/original.jpg', 0, '2025-05-28 08:12:06.905960');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '7d6011d3-40e1-4557-83bb-f2811e2acfc9', 'a9cd2072-a76e-498d-abb6-96bc9f52ceb8', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Tachymarptis melba' LIMIT 1),
           NULL, TRUE, FALSE, '2025-05-28 09:05:06.905960', '2025-05-28 09:05:06.905960'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('eb99e845-bd48-41a2-b15c-ab3c3efcda57', 'a9cd2072-a76e-498d-abb6-96bc9f52ceb8', '9835df77-6efd-4c5e-8697-cc1a95674eb6', 'Beautiful bird, nice photo.', FALSE, '2025-05-30 22:12:06.905960', '2025-05-30 22:12:06.905960');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'eba7b15e-b29b-4db4-9f65-fc01f9846dce', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Observed a Spilopelia senegalensis near Istanbul.', '2026-02-12 20:34:06.906011',
           ST_SetSRID(ST_MakePoint(29.238699, 40.991748), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-02-12 20:34:06.906011', '2026-02-12 20:34:06.906011'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d16bf59e-e6e0-4d45-9b9f-b66529daad57', 'eba7b15e-b29b-4db4-9f65-fc01f9846dce', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636553691/original.jpg', 0, '2026-02-12 20:34:06.906011');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '6bad610e-0bd6-4542-9c56-aad9fa329108', 'eba7b15e-b29b-4db4-9f65-fc01f9846dce', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-12 21:12:06.906011', '2026-02-12 21:12:06.906011'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'a52b8f43-37ae-4caf-b3a5-e6ec6565e3c7', 'eba7b15e-b29b-4db4-9f65-fc01f9846dce', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Spilopelia senegalensis' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-13 15:12:06.906011', '2026-02-13 15:12:06.906011'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '5b83b73c-ffc4-47f8-8271-47d1fa5350ca', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Observed a Motacilla alba near Istanbul.', '2026-04-07 21:47:06.906064',
           ST_SetSRID(ST_MakePoint(28.949244, 41.193993), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-04-07 21:47:06.906064', '2026-04-07 21:47:06.906064'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('d5dfc46d-236f-4e6a-9aa2-6d92beb3b1d6', '5b83b73c-ffc4-47f8-8271-47d1fa5350ca', 'https://static.inaturalist.org/photos/636590131/original.jpg', 0, '2026-04-07 21:47:06.906064');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '04f88422-0b2d-4be3-9e85-5b5d2a0c195a', '5b83b73c-ffc4-47f8-8271-47d1fa5350ca', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           NULL, TRUE, FALSE, '2026-04-07 21:57:06.906064', '2026-04-07 21:57:06.906064'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '18a83175-8aff-4eb1-b024-61aa94bcd697', '5b83b73c-ffc4-47f8-8271-47d1fa5350ca', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-04-09 06:57:06.906064', '2026-04-09 06:57:06.906064'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('82cd6505-c92d-4a6c-abfc-de7a5338a3a2', '5b83b73c-ffc4-47f8-8271-47d1fa5350ca', '19094605-71ab-468c-8f55-99140d2d1fb9', 'Amazing sighting!', FALSE, '2026-04-08 05:47:06.906064', '2026-04-08 05:47:06.906064');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'de663d43-7d0f-40e3-af62-d74e7955f601', '1e78be55-8ee1-41a5-bea3-7ce19037d064', 'Observed a Acridotheres tristis near Istanbul.', '2026-03-19 09:16:06.906133',
           ST_SetSRID(ST_MakePoint(29.03831, 40.872055), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-03-19 09:16:06.906133', '2026-03-19 09:16:06.906133'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('2c439d1d-9ae0-44cb-b670-630c731bd233', 'de663d43-7d0f-40e3-af62-d74e7955f601', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636528618/original.jpg', 0, '2026-03-19 09:16:06.906133');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '468a950b-f493-4aec-8cc7-237a113b26d5', 'de663d43-7d0f-40e3-af62-d74e7955f601', '1e78be55-8ee1-41a5-bea3-7ce19037d064',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           NULL, TRUE, FALSE, '2026-03-19 10:03:06.906133', '2026-03-19 10:03:06.906133'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'e808f117-2ebd-4b63-b5c5-8e6d8f753533', 'de663d43-7d0f-40e3-af62-d74e7955f601', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Acridotheres tristis' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-03-19 22:03:06.906133', '2026-03-19 22:03:06.906133'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('83178617-7be7-4919-b3f3-740fe5f1290a', 'de663d43-7d0f-40e3-af62-d74e7955f601', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Great find for this time of year.', FALSE, '2026-03-22 06:16:06.906133', '2026-03-22 06:16:06.906133');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'b822cff2-6999-4938-ba11-0fe09907724c', 'bbacde32-2240-4239-b84b-759b431c6c7f', 'Observed a Motacilla alba near Istanbul.', '2026-02-27 11:28:06.906197',
           ST_SetSRID(ST_MakePoint(29.089596, 40.911424), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2026-02-27 11:28:06.906197', '2026-02-27 11:28:06.906197'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('58703e5f-df04-41eb-a2a2-2bc7a95042fa', 'b822cff2-6999-4938-ba11-0fe09907724c', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636567333/original.jpg', 0, '2026-02-27 11:28:06.906197');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '8e9857a6-2e33-4b84-a471-faf034fb8725', 'b822cff2-6999-4938-ba11-0fe09907724c', 'bbacde32-2240-4239-b84b-759b431c6c7f',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           NULL, TRUE, FALSE, '2026-02-27 11:44:06.906197', '2026-02-27 11:44:06.906197'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '434cd7d1-87df-45b5-a318-ea2e4424d6fb', 'b822cff2-6999-4938-ba11-0fe09907724c', '19094605-71ab-468c-8f55-99140d2d1fb9',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2026-02-28 21:44:06.906197', '2026-02-28 21:44:06.906197'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '47f0fe10-c2a9-42d9-b90e-8d626a684598', '16795721-9825-4046-bad9-70dd300a2e0f', '', '2025-09-28 12:04:06.906251',
           ST_SetSRID(ST_MakePoint(29.238741, 40.947614), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-09-28 12:04:06.906251', '2025-09-28 12:04:06.906251'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('36cbe533-1a4f-4ed0-bde1-419965bc0123', '47f0fe10-c2a9-42d9-b90e-8d626a684598', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636544397/medium.jpg', 0, '2025-09-28 12:04:06.906251');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '00eaab84-78eb-4943-a832-bc1ef00ee44d', '47f0fe10-c2a9-42d9-b90e-8d626a684598', '16795721-9825-4046-bad9-70dd300a2e0f',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           NULL, TRUE, FALSE, '2025-09-28 12:16:06.906251', '2025-09-28 12:16:06.906251'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('9f624e6d-a3b1-416e-a2d8-7ecdced2f935', '47f0fe10-c2a9-42d9-b90e-8d626a684598', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Great find for this time of year.', FALSE, '2025-09-30 09:04:06.906251', '2025-09-30 09:04:06.906251');

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           '92d48e90-dcd6-4ceb-861c-709f24476713', '208ce275-f84a-4a07-b254-1ac56ce149fb', '', '2025-08-04 11:06:06.906303',
           ST_SetSRID(ST_MakePoint(29.249379, 40.966432), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Fulica atra' LIMIT 1),
           'NEEDS_ID', FALSE, '2025-08-04 11:06:06.906303', '2025-08-04 11:06:06.906303'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('b298b268-9948-4eb9-97e0-9753e119cad7', '92d48e90-dcd6-4ceb-861c-709f24476713', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636540976/medium.jpg', 0, '2025-08-04 11:06:06.906303');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '990c48b6-f4b5-47a4-b4d6-f17c7f51f741', '92d48e90-dcd6-4ceb-861c-709f24476713', '208ce275-f84a-4a07-b254-1ac56ce149fb',
           (SELECT id FROM taxa WHERE scientific_name = 'Fulica atra' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-04 11:28:06.906303', '2025-08-04 11:28:06.906303'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '75def879-7618-4b47-ab5f-98f16eff2b52', '92d48e90-dcd6-4ceb-861c-709f24476713', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Motacilla alba' LIMIT 1),
           'Looks more like a Motacilla alba to me.', TRUE, FALSE, '2025-08-06 08:28:06.906303', '2025-08-06 08:28:06.906303'
       );

INSERT INTO observations (id, user_id, description, observed_at, location, location_name, community_taxon_id, quality_grade, is_deleted, created_at, updated_at)
VALUES (
           'd77dd881-0541-46a1-b64f-0fe9dfd1cdf2', '214797bd-8eb5-4d1b-b339-219fda0374d8', '', '2025-08-27 02:50:06.906357',
           ST_SetSRID(ST_MakePoint(28.720053, 40.914929), 4326), 'Istanbul, Turkey',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'RESEARCH_GRADE', FALSE, '2025-08-27 02:50:06.906357', '2025-08-27 02:50:06.906357'
       );

INSERT INTO observation_images (id, observation_id, image_url, position, created_at)
VALUES ('40685459-94db-4625-863e-c82170fe8c90', 'd77dd881-0541-46a1-b64f-0fe9dfd1cdf2', 'https://inaturalist-open-data.s3.amazonaws.com/photos/636991866/original.jpg', 0, '2025-08-27 02:50:06.906357');

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           '3d77fffe-cdbe-4320-8b80-5bd59ebd7a92', 'd77dd881-0541-46a1-b64f-0fe9dfd1cdf2', '214797bd-8eb5-4d1b-b339-219fda0374d8',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           NULL, TRUE, FALSE, '2025-08-27 03:37:06.906357', '2025-08-27 03:37:06.906357'
       );

INSERT INTO identifications (id, observation_id, user_id, taxon_id, comment, is_current, is_withdrawn, created_at, updated_at)
VALUES (
           'd5586304-e19e-4dee-b7c3-36cd89c9f9f2', 'd77dd881-0541-46a1-b64f-0fe9dfd1cdf2', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0',
           (SELECT id FROM taxa WHERE scientific_name = 'Parus major' LIMIT 1),
           'Agree with this ID.', TRUE, FALSE, '2025-08-27 14:37:06.906357', '2025-08-27 14:37:06.906357'
       );

INSERT INTO comments (id, observation_id, user_id, body, is_deleted, created_at, updated_at)
VALUES ('c459816b-e9ff-4f0d-8e86-23fc61b06584', 'd77dd881-0541-46a1-b64f-0fe9dfd1cdf2', 'e38ec6bd-0550-4803-862c-cc1ae68bf5c0', 'Beautiful bird, nice photo.', FALSE, '2025-08-27 05:50:06.906357', '2025-08-27 05:50:06.906357');