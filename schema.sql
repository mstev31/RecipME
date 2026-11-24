-- RecipME 3NF Relational Schema for Cloudflare D1 (SQLite)
-- Supports isolated 24-hour guest sessions + prepopulated Demo Day presenter accounts

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS guests (
  guest_id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  is_prepopulated INTEGER NOT NULL DEFAULT 0,
  badge_color TEXT NOT NULL DEFAULT '#C2410C',
  created_at TEXT NOT NULL,
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS idea (
  guest_id TEXT NOT NULL,
  idea_id INTEGER NOT NULL,
  idea_title TEXT NOT NULL,
  idea_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (guest_id, idea_id),
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe (
  guest_id TEXT NOT NULL,
  recipe_id INTEGER NOT NULL,
  source_idea_id INTEGER,
  recipe_title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  prep_time_min INTEGER,
  cook_time_min INTEGER,
  servings INTEGER,
  difficulty INTEGER,
  personal_notes TEXT NOT NULL DEFAULT '',
  photo_path TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (guest_id, recipe_id),
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS step (
  guest_id TEXT NOT NULL,
  step_id INTEGER NOT NULL,
  recipe_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  PRIMARY KEY (guest_id, step_id),
  FOREIGN KEY (guest_id, recipe_id) REFERENCES recipe(guest_id, recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingredient (
  guest_id TEXT NOT NULL,
  ingredient_id INTEGER NOT NULL,
  ingredient_name TEXT NOT NULL,
  PRIMARY KEY (guest_id, ingredient_id),
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
  guest_id TEXT NOT NULL,
  recipe_id INTEGER NOT NULL,
  ingredient_id INTEGER NOT NULL,
  quantity REAL,
  unit TEXT NOT NULL DEFAULT '',
  line_order INTEGER NOT NULL,
  PRIMARY KEY (guest_id, recipe_id, ingredient_id),
  FOREIGN KEY (guest_id, recipe_id) REFERENCES recipe(guest_id, recipe_id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id, ingredient_id) REFERENCES ingredient(guest_id, ingredient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tag (
  guest_id TEXT NOT NULL,
  tag_id INTEGER NOT NULL,
  tag_name TEXT NOT NULL,
  is_preset INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (guest_id, tag_id),
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_tag (
  guest_id TEXT NOT NULL,
  recipe_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (guest_id, recipe_id, tag_id),
  FOREIGN KEY (guest_id, recipe_id) REFERENCES recipe(guest_id, recipe_id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id, tag_id) REFERENCES tag(guest_id, tag_id) ON DELETE CASCADE
);

-- =====================================================================
-- PREPOPULATED PRESENTER ACCOUNT 1: Demo Day Host
-- =====================================================================
INSERT OR IGNORE INTO guests (guest_id, guest_name, is_prepopulated, badge_color, created_at, expires_at)
VALUES ('demo_presenter_1', 'Demo Day Host', 1, '#C2410C', datetime('now'), NULL);

INSERT OR IGNORE INTO tag (guest_id, tag_id, tag_name, is_preset) VALUES
  ('demo_presenter_1', 1, 'Chicken', 1),
  ('demo_presenter_1', 2, 'Weeknight', 1),
  ('demo_presenter_1', 3, 'Fish', 1),
  ('demo_presenter_1', 4, 'Gluten-Free', 1),
  ('demo_presenter_1', 5, 'Holiday', 1),
  ('demo_presenter_1', 6, 'Vegetarian', 1);

INSERT OR IGNORE INTO idea (guest_id, idea_id, idea_title, idea_note, created_at, updated_at) VALUES
  ('demo_presenter_1', 1, 'Honey chipotle chicken', 'Honey chipotle chicken. Try with lime and garlic, maybe over rice.', datetime('now'), datetime('now')),
  ('demo_presenter_1', 2, 'Smoked turkey gumbo variation', 'Try Kayla''s idea: smoked turkey instead of sausage for next Thanksgiving.', datetime('now'), datetime('now')),
  ('demo_presenter_1', 3, 'Blackened catfish tacos with lime crema', 'Quick weeknight fish tacos with shredded cabbage, lime juice, and garlic sour cream.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO recipe (guest_id, recipe_id, source_idea_id, recipe_title, description, prep_time_min, cook_time_min, servings, difficulty, personal_notes, photo_path, created_at, updated_at) VALUES
  ('demo_presenter_1', 1, 1, 'Honey chipotle chicken', 'Honey chipotle chicken. Try with lime and garlic, maybe over rice.', 15, 20, 4, 2, 'Double the sauce next time.', '', datetime('now'), datetime('now')),
  ('demo_presenter_1', 2, NULL, 'Mama''s Chicken and Sausage Gumbo', 'The gumbo we make every Christmas Eve. Dark roux, takes patience.', 45, 135, 12, 4, 'Stir the whole time. Don''t walk away.', '', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO step (guest_id, step_id, recipe_id, step_number, instruction) VALUES
  ('demo_presenter_1', 1, 1, 1, 'Mix honey, chopped chipotle, lime juice, and garlic.'),
  ('demo_presenter_1', 2, 1, 2, 'Marinate the chicken for 10 minutes and sear until caramelized.'),
  ('demo_presenter_1', 3, 2, 1, 'Make the roux with oil and flour, stirring until it is the color of chocolate.'),
  ('demo_presenter_1', 4, 2, 2, 'Add chopped onions, bell pepper, and celery and stir until softened.'),
  ('demo_presenter_1', 5, 2, 3, 'Simmer gently with stock, chicken, and sliced andouille sausage.');

INSERT OR IGNORE INTO ingredient (guest_id, ingredient_id, ingredient_name) VALUES
  ('demo_presenter_1', 1, 'chicken thighs'),
  ('demo_presenter_1', 2, 'honey'),
  ('demo_presenter_1', 3, 'chipotle peppers in adobo'),
  ('demo_presenter_1', 4, 'limes'),
  ('demo_presenter_1', 5, 'chicken'),
  ('demo_presenter_1', 6, 'andouille sausage'),
  ('demo_presenter_1', 7, 'vegetable oil'),
  ('demo_presenter_1', 8, 'all-purpose flour'),
  ('demo_presenter_1', 9, 'green onions');

INSERT OR IGNORE INTO recipe_ingredient (guest_id, recipe_id, ingredient_id, quantity, unit, line_order) VALUES
  ('demo_presenter_1', 1, 1, 2, 'lb', 1),
  ('demo_presenter_1', 1, 2, 3, 'tbsp', 2),
  ('demo_presenter_1', 1, 3, 2, '', 3),
  ('demo_presenter_1', 1, 4, 2, '', 4),
  ('demo_presenter_1', 2, 5, 2, 'lb', 1),
  ('demo_presenter_1', 2, 6, 1, 'lb', 2),
  ('demo_presenter_1', 2, 7, 1, 'cup', 3),
  ('demo_presenter_1', 2, 8, 1, 'cup', 4),
  ('demo_presenter_1', 2, 9, 1, 'bunch', 5);

INSERT OR IGNORE INTO recipe_tag (guest_id, recipe_id, tag_id) VALUES
  ('demo_presenter_1', 1, 1),
  ('demo_presenter_1', 1, 2),
  ('demo_presenter_1', 1, 4),
  ('demo_presenter_1', 2, 1),
  ('demo_presenter_1', 2, 5);

-- =====================================================================
-- PREPOPULATED PRESENTER ACCOUNT 2: Family Kitchen
-- =====================================================================
INSERT OR IGNORE INTO guests (guest_id, guest_name, is_prepopulated, badge_color, created_at, expires_at)
VALUES ('demo_presenter_2', 'Family Kitchen', 1, '#3F7D3A', datetime('now'), NULL);

INSERT OR IGNORE INTO tag (guest_id, tag_id, tag_name, is_preset) VALUES
  ('demo_presenter_2', 1, 'Chicken', 1),
  ('demo_presenter_2', 2, 'Weeknight', 1),
  ('demo_presenter_2', 3, 'Fish', 1),
  ('demo_presenter_2', 4, 'Gluten-Free', 1),
  ('demo_presenter_2', 5, 'Holiday', 1),
  ('demo_presenter_2', 6, 'Vegetarian', 1);

INSERT OR IGNORE INTO idea (guest_id, idea_id, idea_title, idea_note, created_at, updated_at) VALUES
  ('demo_presenter_2', 1, 'Roasted garlic parmesan green beans', 'Toss fresh green beans with olive oil, minced garlic, and shaved parmesan at 425F.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO recipe (guest_id, recipe_id, source_idea_id, recipe_title, description, prep_time_min, cook_time_min, servings, difficulty, personal_notes, photo_path, created_at, updated_at) VALUES
  ('demo_presenter_2', 1, NULL, 'Lemon Herb Baked Salmon', 'Simple weeknight baked salmon with fresh dill, butter, and lemon slices.', 10, 18, 4, 1, 'Line the sheet pan with parchment for easy cleanup.', '', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO step (guest_id, step_id, recipe_id, step_number, instruction) VALUES
  ('demo_presenter_2', 1, 1, 1, 'Preheat oven to 400F and pat salmon fillets dry.'),
  ('demo_presenter_2', 2, 1, 2, 'Brush with melted butter, garlic, lemon juice, and chopped dill.'),
  ('demo_presenter_2', 3, 1, 3, 'Bake 15 to 18 minutes until the salmon flakes easily with a fork.');

INSERT OR IGNORE INTO ingredient (guest_id, ingredient_id, ingredient_name) VALUES
  ('demo_presenter_2', 1, 'salmon fillets'),
  ('demo_presenter_2', 2, 'unsalted butter'),
  ('demo_presenter_2', 3, 'lemons'),
  ('demo_presenter_2', 4, 'fresh dill');

INSERT OR IGNORE INTO recipe_ingredient (guest_id, recipe_id, ingredient_id, quantity, unit, line_order) VALUES
  ('demo_presenter_2', 1, 1, 1.5, 'lb', 1),
  ('demo_presenter_2', 1, 2, 3, 'tbsp', 2),
  ('demo_presenter_2', 1, 3, 2, '', 3),
  ('demo_presenter_2', 1, 4, 2, 'tbsp', 4);

INSERT OR IGNORE INTO recipe_tag (guest_id, recipe_id, tag_id) VALUES
  ('demo_presenter_2', 1, 2),
  ('demo_presenter_2', 1, 3),
  ('demo_presenter_2', 1, 4);
