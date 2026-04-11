TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO users (
    id,
    created_at,
    updated_at,
    username,
    email,
    password,
    display_name,
    bio,
    role,
    is_deleted,
    is_suspended,
    email_verified_at,
    avatar_url
)
VALUES
    ('bbacde32-2240-4239-b84b-759b431c6c7f', now(), now(), 'john.admin', 'john@example.com', 'CHANGE_ME', 'John Doe', 'I am an admin', 'ADMIN', FALSE, FALSE, NULL, 'https://mockmind-api.uifaces.co/content/human/80.jpg'),
    ('16795721-9825-4046-bad9-70dd300a2e0f', now(), now(), 'jane.curator', 'jane@example.com', 'CHANGE_ME', 'Jane Smith', 'I am a curator.', 'CURATOR', FALSE, FALSE, NULL, 'https://mockmind-api.uifaces.co/content/human/219.jpg'),

    ('7ab7516d-e659-418d-b8af-977f7c49c12b', now(), now(), 'tony.iommi', 'tony.iommi@example.com', 'CHANGE_ME', 'Tony Iommi', 'Black Sabbath guitarist and riff pioneer.', 'USER', FALSE, FALSE, NULL, 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:262,cw:675,ch:675,q:80,w:675/nJZp7o3zX3ZJ4MwBU6qb5N.jpg'),
    ('1e78be55-8ee1-41a5-bea3-7ce19037d064', now(), now(), 'rob.halford', 'rob.halford@example.com', 'CHANGE_ME', 'Rob Halford', 'Judas Priest frontman known as the Metal God.', 'USER', FALSE, FALSE, NULL, 'https://upload.wikimedia.org/wikipedia/commons/9/96/Halford_2010.jpg'),
    ('fb1aa4df-458a-4aa4-9a1b-d824af8639a8', now(), now(), 'bruce.dickinson', 'bruce.dickinson@example.com', 'CHANGE_ME', 'Bruce Dickinson', 'Iron Maiden lead vocalist.', 'USER', FALSE, FALSE, NULL, 'https://greatbritishspeakers.co.uk/wp-content/uploads/2024/07/Bruce-Dickinson-hire-English-singer-speaker-book-at-agent-Great-British-Speakers.jpg'),
    ('214797bd-8eb5-4d1b-b339-219fda0374d8', now(), now(), 'ronnie.dio', 'ronnie.dio@example.com', 'CHANGE_ME', 'Ronnie James Dio', 'Legendary singer of Dio, Rainbow, and Black Sabbath.', 'USER', FALSE, FALSE, NULL, 'https://cdn-images.dzcdn.net/images/artist/790a78d1b40d843b6818b4075fc8d539/1900x1900-000000-81-0-0.jpg'),
    ('9835df77-6efd-4c5e-8697-cc1a95674eb6', now(), now(), 'dave.mustaine', 'dave.mustaine@example.com', 'CHANGE_ME', 'Dave Mustaine', 'Megadeth founder, vocalist, and guitarist.', 'USER', FALSE, FALSE, NULL, 'https://cdn-images.dzcdn.net/images/artist/bb8939328b1b96cbc5c8eef2dc11a3d9/1900x1900-000000-81-0-0.jpg'),
    ('e38ec6bd-0550-4803-862c-cc1ae68bf5c0', now(), now(), 'lemmy.kilmister', 'lemmy.kilmister@example.com', 'CHANGE_ME', 'Lemmy Kilmister', 'Motörhead founder, bassist, and vocalist.', 'USER', FALSE, FALSE, NULL, 'https://pyxis.nymag.com/v1/imgs/a8d/d61/6e61d0d63d3742b69d512e6534a63770a8-28-lemmy-obit.rsquare.w330.jpg'),
    ('19094605-71ab-468c-8f55-99140d2d1fb9', now(), now(), 'rory.gallagher', 'rory.gallagher@example.com', 'CHANGE_ME', 'Rory Gallagher', 'Irish blues-rock guitarist and singer.', 'USER', FALSE, FALSE, NULL, 'https://images.genius.com/6c183fe3f525ba062e5e9ff76871a0cb.450x450x1.jpg'),
    ('ca8d3847-cbda-4610-a92f-a3045f4c2157', now(), now(), 'david.bowie', 'david.bowie@example.com', 'CHANGE_ME', 'David Bowie', 'Iconic musician known for his genre-defying work.', 'USER', FALSE, FALSE, NULL, 'https://bi.org/wp-content/uploads/2020/01/featured-famous-bi-david-bowie.jpg'),
    ('208ce275-f84a-4a07-b254-1ac56ce149fb', now(), now(), 'zakk.wylde', 'zakk.wylde@example.com', 'CHANGE_ME', 'Zakk Wylde', 'Founder of Black Label Society.', 'USER', FALSE, FALSE, NULL, 'https://bookingagentinfo.com/wp-content/uploads/2022/06/Zakk-Wylde.jpg');

-- Passwords are BCrypt hashed (strength 12): password
UPDATE users
SET password = '$2a$12$LKwHvmHzm1j0HHe73Ot9LOWm9Dcy38ZNISNJP03T5cTUa8mw8uHe6';