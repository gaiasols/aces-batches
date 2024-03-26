DROP TABLE IF EXISTS admins; CREATE TABLE admins (
  [id] INTEGER PRIMARY KEY,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT UNIQUE,
	[hash] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS assessors; CREATE TABLE assessors (
  [id] INTEGER PRIMARY KEY,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT UNIQUE,
	[hash] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS organizations; CREATE TABLE organizations (
  [id] INTEGER PRIMARY KEY,
  [name] TEXT NOT NULL,
  [address] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS modules; CREATE TABLE modules (
  [id] TEXT PRIMARY KEY,
  [category] TEXT CHECK (category IN('SELF', 'CASE', 'FACE', 'DISC')) NOT NULL,
  [title] TEXT NOT NULL,
	[ascent] INTEGER CHECK (ascent IN(0, 1)) NOT NULL,
  [version] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS slots; CREATE TABLE slots (
  [id] INTEGER PRIMARY KEY,
  [modules] INTEGER CHECK(modules IN(1,2,3,4)) NOT NULL,
  [mode] TEXT NOT NULL,
  [slot1] TEXT CHECK (slot1 IN('SELF', 'CASE', 'FACE', 'DISC')),
  [slot2] TEXT CHECK (slot2 IN('SELF', 'CASE', 'FACE', 'DISC')),
  [slot3] TEXT CHECK (slot3 IN('SELF', 'CASE', 'FACE', 'DISC')),
  [slot4] TEXT CHECK (slot4 IN('SELF', 'CASE', 'FACE', 'DISC')),
  [self_pos] INTEGER DEFAULT 0,
  [case_pos] INTEGER DEFAULT 0,
  [face_pos] INTEGER DEFAULT 0,
  [disc_pos] INTEGER DEFAULT 0,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS batches; CREATE TABLE batches (
  [id] INTEGER PRIMARY KEY,
	[token] TEXT NOT NULL UNIQUE,
  [org_id] INTEGER NOT NULL,
	[date] TEXT,
	[type] TEXT CHECK(type IN('ASCENT', 'CUSTOM')) NOT NULL DEFAULT 'ASCENT',
	[mode] TEXT,
  [split] INTEGER CHECK(split IN(1, 2, 3, 4)) NOT NULL DEFAULT 1,
	[title] TEXT NOT NULL DEFAULT 'Batch',
	[status] INTEGER NOT NULL DEFAULT 0, -- 1 (deployed) 2 (maintenance) 3 (closed) 9 (archived)
	[time1] TEXT,
  [time2] TEXT,
  [time3] TEXT,
  [time4] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS batch_modules; CREATE TABLE batch_modules (
	[category] TEXT NOT NULL, -- 'SELF', 'CASE', 'FACE', 'DISC'
	[batch_id] INTEGER NOT NULL,
	[module_id] TEXT NOT NULL,
	[priority] INTEGER, -- used for module ordering in custom assessment
	PRIMARY KEY (batch_id, module_id)
);

DROP TABLE IF EXISTS persons; CREATE TABLE persons (
  [id] TEXT PRIMARY KEY,
  [org_id] INTEGER NOT NULL,
  [batch_id] INTEGER NOT NULL,
  [fullname] TEXT NOT NULL,
  [username] TEXT NOT NULL,
  [email] TEXT,
	[hash] TEXT,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT,
  UNIQUE(batch_id, email)
);

DROP TABLE IF EXISTS groups; CREATE TABLE groups (
  [id] TEXT PRIMARY KEY,
  [batch_id] INTEGER NOT NULL,
  [name] TEXT NOT NULL,
  [slot_id] TEXT,
  [LGDC_ass_id] INTEGER,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT
);

DROP TABLE IF EXISTS groupings; CREATE TABLE groupings (
  batch_id INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  face_ass_id INTEGER,
  case_ass_id INTEGER,
	[created] TEXT NOT NULL DEFAULT (datetime('now')||'Z'),
	[updated] TEXT,
  PRIMARY KEY (batch_id, person_id)
);

-- triggers

CREATE TRIGGER update_admins AFTER UPDATE ON admins
	BEGIN UPDATE admins SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_assessors AFTER UPDATE ON assessors
	BEGIN UPDATE assessors SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_organizations AFTER UPDATE ON organizations
	BEGIN UPDATE organizations SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_modules AFTER UPDATE ON modules
	BEGIN UPDATE modules SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_slots AFTER UPDATE ON slots
	BEGIN UPDATE slots SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_persons AFTER UPDATE ON persons
	BEGIN UPDATE persons SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_batches AFTER UPDATE ON batches
	BEGIN UPDATE batches SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_groups AFTER UPDATE ON groups
	BEGIN UPDATE groups SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

CREATE TRIGGER update_groupings AFTER UPDATE ON groupings
	BEGIN UPDATE groupings SET updated = datetime('now')||'Z' WHERE id = NEW.id;
END;

-- views

DROP VIEW IF EXISTS v_batches; CREATE VIEW v_batches AS SELECT
	b.*,
	o.name org_name,
	(SELECT COUNT(*) from persons WHERE batch_id=b.id) persons,
	(SELECT COUNT(*) from batch_modules WHERE batch_id=b.id) modules
	FROM batches b
	LEFT JOIN organizations o ON b.org_id=o.id;
