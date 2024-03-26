-- admins: 1
INSERT INTO admins (id, fullname, username) VALUES
    (1, 'Admin Utama', 'admin');
-- assessors: 49
INSERT INTO assessors (id, fullname, username) VALUES
    (1, 'Bakiman Bakiono', 'bakiman'),
    (2, 'Wanda Jati', 'wanda'),
    (3, 'Bahuwirya Basupati', 'bahuwirya'),
    (4, 'Sasmaya Wasista', 'sasmaya'),
    (5, 'Buntaran Adiharja', 'buntaran'),
    (6, 'Tasmirah Asirwanda', 'tasmirah'),
    (7, 'Samita Wignya', 'samita'),
    (8, 'Gemana Sasmaka', 'gemana'),
    (9, 'Putri Luhung', 'putri'),
    (10, 'Asmuni Estu', 'asmuni'),
    (11, 'Jumadi Eluh', 'jumadi'),
    (12, 'Aslijan Luwar', 'aslijan'),
    (13, 'Balidin Elon', 'balidin'),
    (14, 'Surastri Puspita', 'surastri'),
    (15, 'Danu Kambali Gunanto', 'danu'),
    (16, 'Karsa Dimaz', 'karsa'),
    (17, 'Budi Candrawimba', 'budi'),
    (18, 'Caket Rina', 'caket'),
    (19, 'Hardana Jayadi Gandi', 'hardana'),
    (20, 'Branta Suci', 'branta'),
    (21, 'Ajimin Sujana', 'ajimin'),
    (22, 'Jabal Basunjaya', 'jabal'),
    (23, 'Bataria Panggih Suciatma', 'bataria'),
    (24, 'Yuwana Cakrabuana', 'yuwana'),
    (25, 'Galih Wyatt', 'galih'),
    (26, 'Shhh Pinda', 'shhh'),
    (27, 'Julian Lintang', 'julian'),
    (28, 'Kunthara Miles Raden', 'kunthara'),
    (29, 'Jonathan Lincoln', 'jonathan'),
    (30, 'Jace Patrick', 'jace'),
    (31, 'Cahyono Isabel', 'cahyono'),
    (32, 'Kamidin Edi Panca', 'kamidin'),
    (33, 'Kusuma Burnadi', 'kusuma'),
    (34, 'Adrian Asmadi', 'adrian'),
    (35, 'Respati Pradipta Widya', 'respati'),
    (36, 'Ambarwati Axel', 'ambarwati'),
    (37, 'Lucas Marlon Bima', 'lucas'),
    (38, 'Cira Harsana', 'cira'),
    (39, 'Josiah Giyono', 'josiah'),
    (40, 'Candrarupa Evan Arjanti', 'candrarupa'),
    (41, 'Arawinda Sambada Merel', 'arawinda'),
    (42, 'Bart Gandik', 'bart'),
    (43, 'Dartono Astutiningtyas', 'dartono'),
    (44, 'Wijaksana Wibisono Luluh', 'wijaksana'),
    (45, 'Gendis Henry', 'gendis'),
    (46, 'Loes Elias', 'loes'),
    (47, 'Windriya Titah', 'windriya'),
    (48, 'Ayu Gunari', 'ayu123'),
    (49, 'Tyas Batari Cahyo', 'tyas');
-- organizations: 3, starts from 11
INSERT INTO organizations (id, name) VALUES
    (11, 'PT Agung Brajak Cunthi'),
    (12, 'PT Dinoyo Environment Futures'),
    (13, 'PT Guthe Harmoni Indonesia');
-- tools: 9, with custom ids
INSERT INTO modules (id, category, title, ascent) VALUES
	('GPQ-01', 'SELF', 'GPQ', 1),
	('GMATE-01', 'SELF', 'G-MATE', 0),
	('CRATE-01', 'SELF', 'C-RATE', 0),
	('CSI-01', 'SELF', 'CSI', 0),
	('GGATE-01', 'SELF', 'G-GATE', 0),
	('AIME-01', 'SELF', 'AIME', 0),
	('GPRO-01', 'SELF', 'G-PRO', 0),
	('CASE-01', 'CASE', 'Case Analysis 1', 1),
	('CASE-02', 'CASE', 'Case Analysis 2', 1),
	('CASE-03', 'CASE', 'Case Analysis 3', 1),
	('INTRAY-01', 'CASE', 'Intray Type 1', 1),
	('INTRAY-02', 'CASE', 'Intray Type 2', 1),
	('INTRAY-03', 'CASE', 'Intray Type 3', 1),
	('SJT-01', 'CASE', 'SJT 1', 0),
	('INTERVIEW-01', 'FACE', 'Interview', 1),
	('PRESENTATION-01', 'FACE', 'Presentation', 1),
	('LGD-01', 'DISC', 'LGD Type 1', 1),
	('LGD-02', 'DISC', 'LGD Type 2', 1),
	('LGD-03', 'DISC', 'LGD Type 3', 1),
	('GPQGMATE-01', 'SELF', 'GPQ & G-MATE', 1),
	('GPQCRATE-01', 'SELF', 'GPQ & C-RATE', 1);
-- slot dummy, delete later
INSERT INTO slots (id, modules, mode) VALUES (10, 1, 'SEED-SLOT');
-- actual slots
INSERT INTO slots (modules, mode, slot1, slot2, slot3, slot4) VALUES
    (4, 'ALL-TYPES', 'FACE', 'SELF', 'CASE', 'DISC'),
    (4, 'ALL-TYPES', 'SELF', 'CASE', 'DISC', 'FACE'),
    (4, 'ALL-TYPES', 'CASE', 'DISC', 'FACE', 'SELF'),
    (4, 'ALL-TYPES', 'DISC', 'FACE', 'SELF', 'CASE');
INSERT INTO slots (modules, mode, slot1, slot2, slot3, slot4) VALUES
    -- 3-no-SELF
    (3, 'NO-SELF', 'FACE', 'CASE', 'DISC', null),
    (3, 'NO-SELF', 'CASE', 'DISC', 'FACE', null),
    (3, 'NO-SELF', 'DISC', 'FACE', 'CASE', null),
    -- 3-no-group
    (3, 'NO-DISC', 'FACE', 'SELF', 'CASE', null),
    (3, 'NO-DISC', 'SELF', 'CASE', 'FACE', null),
    (3, 'NO-DISC', 'CASE', 'FACE', 'SELF', null),
    -- 3-no-CASE
    (3, 'NO-CASE', 'FACE', 'SELF', 'DISC', null),
    (3, 'NO-CASE', 'SELF', 'DISC', 'FACE', null),
    (3, 'NO-CASE', 'DISC', 'FACE', 'SELF', null),
    -- 3-no-FACE
    (3, 'NO-FACE', 'SELF', 'CASE', 'DISC', null),
    (3, 'NO-FACE', 'CASE', 'DISC', 'SELF', null),
    (3, 'NO-FACE', 'DISC', 'SELF', 'CASE', null);
INSERT INTO slots (modules, mode, slot1, slot2, slot3, slot4) VALUES
    -- Tanpa asesor
    (2, 'SELF-CASE', 'SELF', 'CASE', null, null),
    (2, 'SELF-CASE', null, null, 'SELF', 'CASE'),
    --
    (2, 'SELF-DISC', 'SELF', 'DISC', null, null),
    (2, 'SELF-DISC', 'DISC', 'SELF', null, null),
    (2, 'SELF-DISC', null, null, 'SELF', 'DISC'),
    (2, 'SELF-DISC', null, null, 'DISC', 'SELF'),
    --
    (2, 'SELF-FACE', 'SELF', 'FACE', null, null),
    (2, 'SELF-FACE', 'FACE', 'SELF', null, null),
    (2, 'SELF-FACE', null, null, 'SELF', 'FACE'),
    (2, 'SELF-FACE', null, null, 'FACE', 'SELF'),
    --
    (2, 'CASE-DISC', 'CASE', 'DISC', null, null),
    (2, 'CASE-DISC', 'DISC', 'CASE', null, null),
    (2, 'CASE-DISC', null, null, 'CASE', 'DISC'),
    (2, 'CASE-DISC', null, null, 'DISC', 'CASE'),
    --
    (2, 'CASE-FACE', 'CASE', 'FACE', null, null),
    (2, 'CASE-FACE', 'FACE', 'CASE', null, null),
    (2, 'CASE-FACE', null, null, 'CASE', 'FACE'),
    (2, 'CASE-FACE', null, null, 'FACE', 'CASE'),
    --
    (2, 'DISC-FACE', 'DISC', 'FACE', null, null),
    (2, 'DISC-FACE', 'FACE', 'DISC', null, null),
    (2, 'DISC-FACE', null, null, 'DISC', 'FACE'),
    (2, 'DISC-FACE', null, null, 'FACE', 'DISC');
INSERT INTO slots (modules, mode, slot1, slot2, slot3, slot4) VALUES
    (1, 'SELF-ONLY', 'SELF', null, null, null),
    (1, 'SELF-ONLY', null, 'SELF', null, null),
    (1, 'SELF-ONLY', null, null, 'SELF', null),
    (1, 'SELF-ONLY', null, null, null, 'SELF'),
    --
    (1, 'CASE-ONLY', 'CASE', null, null, null),
    (1, 'CASE-ONLY', null, 'CASE', null, null),
    (1, 'CASE-ONLY', null, null, 'CASE', null),
    (1, 'CASE-ONLY', null, null, null, 'CASE'),
    --
    (1, 'FACE-ONLY', 'FACE', null, null, null),
    (1, 'FACE-ONLY', null, 'FACE', null, null),
    (1, 'FACE-ONLY', null, null, 'FACE', null),
    (1, 'FACE-ONLY', null, null, null, 'FACE'),
    --
    (1, 'DISC-ONLY', 'DISC', null, null, null),
    (1, 'DISC-ONLY', null, 'DISC', null, null),
    (1, 'DISC-ONLY', null, null, 'DISC', null),
    (1, 'DISC-ONLY', null, null, null, 'DISC');
DELETE FROM slots WHERE id=10;
-- UPDATE SLOTS
UPDATE slots SET self_pos=1 WHERE slot1='SELF';
UPDATE slots SET self_pos=2 WHERE slot2='SELF';
UPDATE slots SET self_pos=3 WHERE slot3='SELF';
UPDATE slots SET self_pos=4 WHERE slot4='SELF';
UPDATE slots SET case_pos=1 WHERE slot1='CASE';
UPDATE slots SET case_pos=2 WHERE slot2='CASE';
UPDATE slots SET case_pos=3 WHERE slot3='CASE';
UPDATE slots SET case_pos=4 WHERE slot4='CASE';
-- UPDATE slots SET face_pos=1 WHERE slot1='face';
-- UPDATE slots SET lead_pos=1 WHERE slot1='lead';
UPDATE slots SET face_pos=1 WHERE slot1='FACE';
UPDATE slots SET face_pos=2 WHERE slot2='FACE';
UPDATE slots SET face_pos=3 WHERE slot3='FACE';
UPDATE slots SET face_pos=4 WHERE slot4='FACE';
UPDATE slots SET disc_pos=1 WHERE slot1='DISC';
UPDATE slots SET disc_pos=2 WHERE slot2='DISC';
UPDATE slots SET disc_pos=3 WHERE slot3='DISC';
UPDATE slots SET disc_pos=4 WHERE slot4='DISC';
-- batch_id starts 101, org starts 11
INSERT INTO batches (id, token, org_id, type, date) VALUES
	(101, '101921', 11, 'ASCENT', '2024-03-28'),
	(102, '102280', 12, 'CUSTOM', '2024-04-18'),
	(103, '103006', 13, 'ASCENT', '2024-05-03');

