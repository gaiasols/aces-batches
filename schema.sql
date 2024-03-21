DROP TABLE IF EXISTS admins; CREATE TABLE admins (
  [id] INTEGER PRIMARY KEY,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT UNIQUE,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_admins AFTER UPDATE ON admins
	BEGIN UPDATE admins SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS assessors; CREATE TABLE assessors (
  [id] INTEGER PRIMARY KEY,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT UNIQUE,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_assessors AFTER UPDATE ON assessors
	BEGIN UPDATE assessors SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS organizations; CREATE TABLE organizations (
  [id] INTEGER PRIMARY KEY,
  [name] TEXT NOT NULL,
  [address] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_organizations AFTER UPDATE ON organizations
	BEGIN UPDATE organizations SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS tools; CREATE TABLE tools (
  [id] TEXT PRIMARY KEY,
  [category] TEXT CHECK (category IN('self', 'case', 'f2f', 'lgd')) NOT NULL,
  [title] TEXT NOT NULL,
  [version] TEXT NOT NULL DEFAULT 'generic',
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_tools AFTER UPDATE ON tools
	BEGIN UPDATE tools SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS slots; CREATE TABLE slots (
  [id] INTEGER PRIMARY KEY,
  [modules] INTEGER CHECK(modules IN(1,2,3,4)) NOT NULL,
  [mode] TEXT NOT NULL,
  [slot1] TEXT CHECK (slot1 IN('self', 'case', 'f2f', 'lgd')),
  [slot2] TEXT CHECK (slot2 IN('self', 'case', 'f2f', 'lgd')),
  [slot3] TEXT CHECK (slot3 IN('self', 'case', 'f2f', 'lgd')),
  [slot4] TEXT CHECK (slot4 IN('self', 'case', 'f2f', 'lgd')),
  [self_pos] INTEGER DEFAULT 0,
  [case_pos] INTEGER DEFAULT 0,
  [f2f_pos] INTEGER DEFAULT 0,
  [lgd_pos] INTEGER DEFAULT 0,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_slots AFTER UPDATE ON slots
	BEGIN UPDATE slots SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS batches; CREATE TABLE batches (
  [id] INTEGER PRIMARY KEY,
	[token] TEXT NOT NULL UNIQUE,
  [org_id] INTEGER NOT NULL,
  [name] TEXT NOT NULL,
  [date] TEXT,
  [mode] TEXT,
  [split] INTEGER CHECK(split IN(1, 2, 3, 4)) NOT NULL DEFAULT 1,
  [mod_self] TEXT,
  [mod_case] TEXT,
  [mod_f2f] TEXT,
  [mod_lgd] TEXT, -- if not null then need grouping
  [time1] TEXT,
  [time2] TEXT,
  [time3] TEXT,
  [time4] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_batches AFTER UPDATE ON batches
	BEGIN UPDATE batches SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS persons; CREATE TABLE persons (
  [id] TEXT PRIMARY KEY,
  [org_id] INTEGER NOT NULL,
  [batch_id] INTEGER NOT NULL,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT,
  UNIQUE(batch_id, email)
);
CREATE TRIGGER update_persons AFTER UPDATE ON persons
	BEGIN UPDATE persons SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS groups; CREATE TABLE groups (
  [id] TEXT PRIMARY KEY,
  [batch_id] INTEGER NOT NULL,
  [name] TEXT NOT NULL,
  [slot_id] TEXT,
  [lgd_ass_id] INTEGER,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);
CREATE TRIGGER update_groups AFTER UPDATE ON groups
	BEGIN UPDATE groups SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

DROP TABLE IF EXISTS groupings; CREATE TABLE groupings (
  batch_id INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  f2f_ass_id INTEGER,
  case_ass_id INTEGER,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT,
  PRIMARY KEY (batch_id, person_id)
);
CREATE TRIGGER update_groupings AFTER UPDATE ON groupings
	BEGIN UPDATE groupings SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

-- VOrganization
DROP VIEW IF EXISTS v_organizations; CREATE VIEW v_organizations AS SELECT
	o.*,
	(SELECT COUNT(*) FROM batches WHERE org_id=o.id) batches,
	(SELECT COUNT(*) FROM persons WHERE org_id=o.id) heads,
	(SELECT min(date) FROM batches WHERE org_id=o.id) first_batch,
	(SELECT max(date) FROM batches WHERE org_id=o.id) last_batch,
	(SELECT id FROM organizations WHERE id>o.id LIMIT 1) next_id,
	(SELECT id FROM organizations WHERE id<o.id ORDER BY id DESC LIMIT 1) prev_id
	FROM organizations o;
-- VBatch
DROP VIEW IF EXISTS v_batches; CREATE VIEW v_batches AS SELECT
  -- b.*,
	b.id,
	b.name,
	b.org_id,
  o.name org_name,
	--
	b.date,
	b.mode,
	b.split,
	-- modules
	b.mod_self,
	b.mod_case,
	b.mod_f2f,
	b.mod_lgd,
  t1.title mod_self_title,
  t2.title mod_case_title,
  t3.title mod_f2f_title,
  t4.title mod_lgd_title,
	-- times
	b.time1,
	b.time2,
	b.time3,
	b.time4,
  -- o.name org_name,
  s.modules,
  (SELECT count(distinct slot_id) FROM groups WHERE batch_id=b.id) permutation,
  (CASE WHEN mod_lgd IS NOT NULL THEN 'group' ELSE 'slot' END) group_type,
  (CASE WHEN (mod_lgd IS NOT NULL OR mod_f2f IS NOT NULL) THEN 1 ELSE 0 END) need_assessors,
  (SELECT COUNT(*) from persons WHERE batch_id=b.id) persons,
  (SELECT COUNT(*) from groups WHERE batch_id=b.id) groups
  FROM batches b
  LEFT JOIN organizations o ON b.org_id=o.id
  LEFT JOIN slots s ON b.mode=s.mode
  left join tools t1 on b.mod_self=t1.id
  left join tools t2 on b.mod_case=t2.id
  left join tools t3 on b.mod_f2f=t3.id
  left join tools t4 on b.mod_lgd=t4.id
  GROUP BY b.id;
-- VGroups
DROP VIEW IF EXISTS v_groups; CREATE VIEW v_groups AS SELECT
  gr.*,
  a.fullname lgd_assessor_name,
  (SELECT COUNT(*) FROM groupings WHERE group_id=gr.id) members,
  s.slot1, s.slot2, s.slot3, s.slot4,
  s.self_pos, s.case_pos, s.f2f_pos, s.lgd_pos
  FROM groups gr
  LEFT JOIN slots s ON gr.slot_id=s.id
  LEFT JOIN assessors a ON gr.lgd_ass_id=a.id;
-- VGroupings
DROP VIEW IF EXISTS v_groupings; CREATE VIEW v_groupings AS SELECT
  gg.*, s.self_pos, s.case_pos, s.f2f_pos, s.lgd_pos
  FROM groupings gg
  LEFT JOIN groups gr ON gg.group_id=gr.id
  LEFT JOIN slots s ON gr.slot_id=s.id;
-- VPersons
DROP VIEW IF EXISTS v_persons; CREATE VIEW v_persons AS SELECT
  p.*, o.name org_name,
  gg.group_id, gr.name group_name,
  gr.lgd_ass_id, a3.fullname lgd_assessor_name,
  gg.f2f_ass_id, a1.fullname f2f_assessor_name,
  gg.case_ass_id, a2.fullname case_assessor_name,
  gr.slot_id, s.slot1, s.slot2, s.slot3, s.slot4,
	s.self_pos, s.case_pos, s.f2f_pos, s.lgd_pos
  FROM persons p
  LEFT JOIN organizations o ON p.org_id=o.id
  LEFT JOIN groupings gg ON p.id=gg.person_id
  LEFT JOIN groups gr ON gg.group_id=gr.id
  LEFT JOIN slots s ON gr.slot_id=s.id
  LEFT JOIN assessors a1 ON gg.f2f_ass_id=a1.id
  LEFT JOIN assessors a2 ON gg.case_ass_id=a2.id
  LEFT JOIN assessors a3 ON gr.lgd_ass_id=a3.id;
-- VExperts
DROP VIEW IF EXISTS v_slotallocs; CREATE VIEW v_slotallocs AS SELECT
  batch_id,
  (SELECT count(*) FROM v_groups WHERE slot1='lgd' AND batch_id=g.batch_id) AS lgd_slot1,
  (SELECT count(*) FROM v_groups WHERE slot2='lgd' AND batch_id=g.batch_id) AS lgd_slot2,
  (SELECT count(*) FROM v_groups WHERE slot3='lgd' AND batch_id=g.batch_id) AS lgd_slot3,
  (SELECT count(*) FROM v_groups WHERE slot4='lgd' AND batch_id=g.batch_id) AS lgd_slot4,
  (SELECT count(*) FROM v_groups WHERE slot1='f2f' AND batch_id=g.batch_id) AS f2f_slot1,
  (SELECT count(*) FROM v_groups WHERE slot2='f2f' AND batch_id=g.batch_id) AS f2f_slot2,
  (SELECT count(*) FROM v_groups WHERE slot3='f2f' AND batch_id=g.batch_id) AS f2f_slot3,
  (SELECT count(*) FROM v_groups WHERE slot4='f2f' AND batch_id=g.batch_id) AS f2f_slot4,
  (SELECT sum(members) FROM v_groups WHERE slot1='f2f' AND batch_id=g.batch_id) AS f2f_slot1_size,
  (SELECT sum(members) FROM v_groups WHERE slot2='f2f' AND batch_id=g.batch_id) AS f2f_slot2_size,
  (SELECT sum(members) FROM v_groups WHERE slot3='f2f' AND batch_id=g.batch_id) AS f2f_slot3_size,
  (SELECT sum(members) FROM v_groups WHERE slot4='f2f' AND batch_id=g.batch_id) AS f2f_slot4_size,
  (select COUNT(distinct slot_id) from groups where batch_id=g.batch_id) AS permutation
  FROM v_groups g
  GROUP BY batch_id;
--
DROP TABLE IF EXISTS batch_assessors; CREATE TABLE batch_assessors (
  [batch_id] INTEGER NOT NULL,
  [ass_id] INTEGER NOT NULL,
  [type] TEXT CHECK(type IN('f2f', 'lgd', 'case')) NOT NULL,
	[slot1] INTEGER CHECK(slot1 IN(0, 1)) NOT NULL DEFAULT 1,
	[slot2] INTEGER CHECK(slot2 IN(0, 1)) NOT NULL DEFAULT 1,
	[slot3] INTEGER CHECK(slot3 IN(0, 1)) NOT NULL DEFAULT 1,
	[slot4] INTEGER CHECK(slot4 IN(0, 1)) NOT NULL DEFAULT 1,
  PRIMARY KEY (batch_id, ass_id)
);
DROP VIEW IF EXISTS v_batch_assessors; CREATE VIEW v_batch_assessors AS SELECT
	ba.*,
	fullname, username, email
	FROM batch_assessors ba
	LEFT JOIN assessors a ON ba.ass_id=a.id;
