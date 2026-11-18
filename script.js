/*************************************************************************
 * PREDETERMINED DEMO ACCOUNTS (For Cloudflare Pages / Live Presentation)
 *************************************************************************/
const DEMO_ACCOUNTS = {
  jordan: {
    id: 'demo_jordan',
    name: 'Jordan Mitchell',
    email: 'jordan.demo@recipme.app',
    password: 'RecipME2026!',
    initials: 'JM',
    badgeColor: '#C2410C'
  },
  doris: {
    id: 'demo_doris',
    name: 'Doris Thibodeaux',
    email: 'doris.demo@recipme.app',
    password: 'RecipME2026!',
    initials: 'DT',
    badgeColor: '#3F7D3A'
  }
};

/*************************************************************************
 * LAYER 1: STORAGE SERVICE & LOCAL RELATIONAL DATABASE (3NF Schema)
 * Implements exact tables from Milestone Two v1 - PBI Schemas:
 * 1. idea (idea_id, idea_title, idea_note, created_at, updated_at)
 * 2. recipe (recipe_id, source_idea_id, recipe_title, description,
 *            prep_time_min, cook_time_min, servings, difficulty,
 *            personal_notes, photo_path, created_at, updated_at)
 *    *Note: Total time is NEVER stored in `recipe` to maintain 3NF!
 * 3. step (step_id, recipe_id, step_number, instruction)
 * 4. ingredient (ingredient_id, ingredient_name)
 * 5. recipe_ingredient (recipe_id, ingredient_id, quantity, unit, line_order)
 * 6. tag (tag_id, tag_name, is_preset)
 * 7. recipe_tag (recipe_id, tag_id)
 *************************************************************************/
const StorageService = {
  SESSION_KEY: 'recipme_active_demo_user_v1',
  currentUser: null,
  db: null,

  getStorageKey() {
    const uid = this.currentUser ? this.currentUser.id : 'demo_jordan';
    return `recipme_sqlite_db_${uid}_v1`;
  },

  // Default initial dataset matching Jordan & Doris scenarios + Key Screen 2.4
  getSeedDatabase(userId = 'demo_jordan') {
    const now = new Date().toISOString();
    const baseTags = [
      { tag_id: 1, tag_name: "Chicken", is_preset: true },
      { tag_id: 2, tag_name: "Weeknight", is_preset: true },
      { tag_id: 3, tag_name: "Fish", is_preset: true },
      { tag_id: 4, tag_name: "Gluten-Free", is_preset: true },
      { tag_id: 5, tag_name: "Holiday", is_preset: true },
      { tag_id: 6, tag_name: "Vegetarian", is_preset: true }
    ];

    if (userId === 'demo_doris') {
      return {
        idea: [
          {
            idea_id: 1,
            idea_title: "Smoked turkey gumbo variation",
            idea_note: "Try Kayla's idea: smoked turkey instead of sausage for next Thanksgiving.",
            created_at: now,
            updated_at: now
          }
        ],
        recipe: [
          {
            recipe_id: 2,
            source_idea_id: null,
            recipe_title: "Mama's Chicken and Sausage Gumbo",
            description: "The gumbo we make every Christmas Eve. Dark roux, takes patience.",
            prep_time_min: 45,
            cook_time_min: 135,
            servings: 12,
            difficulty: 4,
            personal_notes: "Stir the whole time. Don't walk away.",
            photo_path: "",
            created_at: now,
            updated_at: now
          }
        ],
        step: [
          { step_id: 1, recipe_id: 2, step_number: 1, instruction: "Make the roux with oil and flour, stirring until it is the color of chocolate." },
          { step_id: 2, recipe_id: 2, step_number: 2, instruction: "Add chopped onions, bell pepper, and celery and stir until softened." },
          { step_id: 3, recipe_id: 2, step_number: 3, instruction: "Simmer gently with stock, chicken, and sliced andouille sausage." }
        ],
        ingredient: [
          { ingredient_id: 5, ingredient_name: "chicken" },
          { ingredient_id: 6, ingredient_name: "andouille sausage" },
          { ingredient_id: 7, ingredient_name: "vegetable oil" },
          { ingredient_id: 8, ingredient_name: "all-purpose flour" },
          { ingredient_id: 9, ingredient_name: "green onions" }
        ],
        recipe_ingredient: [
          { recipe_id: 2, ingredient_id: 5, quantity: 2, unit: "lb", line_order: 1 },
          { recipe_id: 2, ingredient_id: 6, quantity: 1, unit: "lb", line_order: 2 },
          { recipe_id: 2, ingredient_id: 7, quantity: 1, unit: "cup", line_order: 3 },
          { recipe_id: 2, ingredient_id: 8, quantity: 1, unit: "cup", line_order: 4 },
          { recipe_id: 2, ingredient_id: 9, quantity: 1, unit: "bunch", line_order: 5 }
        ],
        tag: baseTags,
        recipe_tag: [
          { recipe_id: 2, tag_id: 1 },
          { recipe_id: 2, tag_id: 5 }
        ]
      };
    }

    return {
      idea: [
        {
          idea_id: 1,
          idea_title: "Honey chipotle chicken",
          idea_note: "Honey chipotle chicken. Try with lime and garlic, maybe over rice.",
          created_at: now,
          updated_at: now
        },
        {
          idea_id: 2,
          idea_title: "Smoked turkey gumbo variation",
          idea_note: "Try Kayla's idea: smoked turkey instead of sausage for next Thanksgiving.",
          created_at: now,
          updated_at: now
        },
        {
          idea_id: 3,
          idea_title: "Blackened catfish tacos with lime crema",
          idea_note: "Quick weeknight fish tacos with shredded cabbage, lime juice, and garlic sour cream.",
          created_at: now,
          updated_at: now
        }
      ],
      recipe: [
        {
          recipe_id: 1,
          source_idea_id: 1,
          recipe_title: "Honey chipotle chicken",
          description: "Honey chipotle chicken. Try with lime and garlic, maybe over rice.",
          prep_time_min: 15,
          cook_time_min: 20,
          servings: 4,
          difficulty: 2,
          personal_notes: "Double the sauce next time.",
          photo_path: "",
          created_at: now,
          updated_at: now
        },
        {
          recipe_id: 2,
          source_idea_id: null,
          recipe_title: "Mama's Chicken and Sausage Gumbo",
          description: "The gumbo we make every Christmas Eve. Dark roux, takes patience.",
          prep_time_min: 45,
          cook_time_min: 135,
          servings: 12,
          difficulty: 4,
          personal_notes: "Stir the whole time. Don't walk away.",
          photo_path: "",
          created_at: now,
          updated_at: now
        }
      ],
      step: [
        { step_id: 1, recipe_id: 1, step_number: 1, instruction: "Mix honey, chopped chipotle, lime juice, and garlic." },
        { step_id: 2, recipe_id: 1, step_number: 2, instruction: "Marinate the chicken for 10 minutes." },
        { step_id: 3, recipe_id: 2, step_number: 1, instruction: "Make the roux with oil and flour, stirring until it is the color of chocolate." },
        { step_id: 4, recipe_id: 2, step_number: 2, instruction: "Add chopped onions, bell pepper, and celery and stir until softened." },
        { step_id: 5, recipe_id: 2, step_number: 3, instruction: "Simmer gently with stock, chicken, and sliced andouille sausage." }
      ],
      ingredient: [
        { ingredient_id: 1, ingredient_name: "chicken thighs" },
        { ingredient_id: 2, ingredient_name: "honey" },
        { ingredient_id: 3, ingredient_name: "chipotle peppers in adobo" },
        { ingredient_id: 4, ingredient_name: "limes" },
        { ingredient_id: 5, ingredient_name: "chicken" },
        { ingredient_id: 6, ingredient_name: "andouille sausage" },
        { ingredient_id: 7, ingredient_name: "vegetable oil" },
        { ingredient_id: 8, ingredient_name: "all-purpose flour" },
        { ingredient_id: 9, ingredient_name: "green onions" }
      ],
      recipe_ingredient: [
        { recipe_id: 1, ingredient_id: 1, quantity: 2, unit: "lb", line_order: 1 },
        { recipe_id: 1, ingredient_id: 2, quantity: 3, unit: "tbsp", line_order: 2 },
        { recipe_id: 1, ingredient_id: 3, quantity: 2, unit: "", line_order: 3 },
        { recipe_id: 1, ingredient_id: 4, quantity: 2, unit: "", line_order: 4 },
        { recipe_id: 2, ingredient_id: 5, quantity: 2, unit: "lb", line_order: 1 },
        { recipe_id: 2, ingredient_id: 6, quantity: 1, unit: "lb", line_order: 2 },
        { recipe_id: 2, ingredient_id: 7, quantity: 1, unit: "cup", line_order: 3 },
        { recipe_id: 2, ingredient_id: 8, quantity: 1, unit: "cup", line_order: 4 },
        { recipe_id: 2, ingredient_id: 9, quantity: 1, unit: "bunch", line_order: 5 }
      ],
      tag: baseTags,
      recipe_tag: [
        { recipe_id: 1, tag_id: 1 }, // Chicken
        { recipe_id: 1, tag_id: 2 }, // Weeknight
        { recipe_id: 1, tag_id: 4 }, // Gluten-Free
        { recipe_id: 2, tag_id: 1 }, // Chicken
        { recipe_id: 2, tag_id: 5 }  // Holiday
      ]
    };
  },

  init() {
    try {
      const savedSession = localStorage.getItem(this.SESSION_KEY);
      this.currentUser = savedSession ? JSON.parse(savedSession) : DEMO_ACCOUNTS.jordan;
      this.loadActiveUserDatabase();
    } catch (err) {
      console.error("Database initialization fallback:", err);
      this.currentUser = DEMO_ACCOUNTS.jordan;
      this.db = this.getSeedDatabase(this.currentUser.id);
    }
  },

  loadActiveUserDatabase() {
    try {
      const saved = localStorage.getItem(this.getStorageKey());
      if (saved) {
        this.db = JSON.parse(saved);
      } else {
        this.db = this.getSeedDatabase(this.currentUser.id);
        this.commit();
      }
    } catch (err) {
      this.db = this.getSeedDatabase(this.currentUser.id);
    }
  },

  setActiveUser(userObj) {
    this.currentUser = userObj;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userObj));
    this.loadActiveUserDatabase();
  },

  // Autosaves every change to localStorage and triggers UI indicator
  commit() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.db));
      document.getElementById('storage-error-banner')?.classList.add('hidden');
      UI.notifyAutosave();
      UI.updateNavBadges();
    } catch (err) {
      // PBI 20: Plain-language message if save fails or device is out of space
      document.getElementById('storage-error-banner')?.classList.remove('hidden');
    }
  },

  resetToSeed() {
    this.db = this.getSeedDatabase(this.currentUser.id);
    this.commit();
  },

  nextId(tableName, pkField) {
    const rows = this.db[tableName] || [];
    if (rows.length === 0) return 1;
    return Math.max(...rows.map(r => Number(r[pkField]) || 0)) + 1;
  },

  // Generates a complete 3NF SQLite DDL + INSERT script for export
  generateSQLiteDump() {
    const escSql = (val) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      if (typeof val === 'boolean') return val ? '1' : '0';
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    const lines = [
      '-- RecipME 3NF SQLite Relational Schema & Data Export',
      'PRAGMA foreign_keys = ON;',
      '',
      'CREATE TABLE IF NOT EXISTS idea (',
      '  idea_id INTEGER PRIMARY KEY,',
      '  idea_title TEXT NOT NULL,',
      '  idea_note TEXT,',
      '  created_at DATETIME NOT NULL,',
      '  updated_at DATETIME NOT NULL',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS recipe (',
      '  recipe_id INTEGER PRIMARY KEY,',
      '  source_idea_id INTEGER REFERENCES idea(idea_id),',
      '  recipe_title TEXT NOT NULL,',
      '  description TEXT,',
      '  prep_time_min INTEGER,',
      '  cook_time_min INTEGER,',
      '  servings INTEGER,',
      '  difficulty INTEGER,',
      '  personal_notes TEXT,',
      '  photo_path TEXT,',
      '  created_at DATETIME NOT NULL,',
      '  updated_at DATETIME NOT NULL',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS step (',
      '  step_id INTEGER PRIMARY KEY,',
      '  recipe_id INTEGER NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,',
      '  step_number INTEGER NOT NULL,',
      '  instruction TEXT NOT NULL',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS ingredient (',
      '  ingredient_id INTEGER PRIMARY KEY,',
      '  ingredient_name TEXT NOT NULL UNIQUE',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS recipe_ingredient (',
      '  recipe_id INTEGER NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,',
      '  ingredient_id INTEGER NOT NULL REFERENCES ingredient(ingredient_id),',
      '  quantity DECIMAL,',
      '  unit TEXT,',
      '  line_order INTEGER NOT NULL,',
      '  PRIMARY KEY (recipe_id, ingredient_id)',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS tag (',
      '  tag_id INTEGER PRIMARY KEY,',
      '  tag_name TEXT NOT NULL UNIQUE,',
      '  is_preset BOOLEAN NOT NULL',
      ');',
      '',
      'CREATE TABLE IF NOT EXISTS recipe_tag (',
      '  recipe_id INTEGER NOT NULL REFERENCES recipe(recipe_id) ON DELETE CASCADE,',
      '  tag_id INTEGER NOT NULL REFERENCES tag(tag_id),',
      '  PRIMARY KEY (recipe_id, tag_id)',
      ');',
      ''
    ];

    ['idea', 'recipe', 'step', 'ingredient', 'recipe_ingredient', 'tag', 'recipe_tag'].forEach(table => {
      const rows = this.db[table] || [];
      rows.forEach(row => {
        const cols = Object.keys(row).join(', ');
        const vals = Object.values(row).map(escSql).join(', ');
        lines.push(`INSERT INTO ${table} (${cols}) VALUES (${vals});`);
      });
    });

    return lines.join('\n');
  }
};

/*************************************************************************
 * LAYER 2: APPLICATION LOGIC LAYER
 * - IdeasManager: Save an idea, Turn idea into recipe
 * - RecipeManager: Recipe editor, Total-time calculation, Delete w/ confirm
 * - SearchAndFilter: Keyword & ingredient search, Tag filter
 *************************************************************************/
const IdeasManager = {
  getAllIdeas() {
    return [...StorageService.db.idea].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
  },

  getIdeaById(ideaId) {
    return StorageService.db.idea.find(i => i.idea_id === Number(ideaId)) || null;
  },

  // PBI 04: Save a cooking idea in a few seconds
  createIdea(rawText, explicitTitle = "") {
    const trimmed = (rawText || "").trim();
    const titleTrimmed = (explicitTitle || "").trim();
    if (!trimmed && !titleTrimmed) return null;

    let ideaTitle = titleTrimmed;
    let ideaNote = trimmed;

    if (!ideaTitle) {
      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      ideaTitle = lines[0];
      if (lines.length === 1) {
        const dotIndex = trimmed.indexOf('.');
        if (dotIndex > 0 && dotIndex < 55) {
          ideaTitle = trimmed.slice(0, dotIndex).trim();
        }
      } else {
        ideaNote = lines.slice(1).join('\n');
      }
    }

    const now = new Date().toISOString();
    const newIdea = {
      idea_id: StorageService.nextId('idea', 'idea_id'),
      idea_title: ideaTitle,
      idea_note: ideaNote || ideaTitle,
      created_at: now,
      updated_at: now
    };

    StorageService.db.idea.push(newIdea);
    StorageService.commit();
    return newIdea;
  },

  updateIdea(ideaId, fields) {
    const idea = this.getIdeaById(ideaId);
    if (!idea) return;
    if (fields.idea_title !== undefined) idea.idea_title = fields.idea_title;
    if (fields.idea_note !== undefined) idea.idea_note = fields.idea_note;
    idea.updated_at = new Date().toISOString();
    StorageService.commit();
  },

  deleteIdea(ideaId) {
    const id = Number(ideaId);
    StorageService.db.idea = StorageService.db.idea.filter(i => i.idea_id !== id);
    StorageService.db.recipe.forEach(r => {
      if (r.source_idea_id === id) r.source_idea_id = null;
    });
    StorageService.commit();
  },

  // PBI 05: Turn a saved idea into a recipe with title and note filled in
  turnIdeaIntoRecipe(ideaId) {
    const idea = this.getIdeaById(ideaId);
    if (!idea) return null;

    const now = new Date().toISOString();
    const newRecipe = {
      recipe_id: StorageService.nextId('recipe', 'recipe_id'),
      source_idea_id: idea.idea_id,
      recipe_title: idea.idea_title,
      description: idea.idea_note || idea.idea_title,
      prep_time_min: null,
      cook_time_min: null,
      servings: null,
      difficulty: null,
      personal_notes: "",
      photo_path: "",
      created_at: now,
      updated_at: now
    };

    StorageService.db.recipe.push(newRecipe);
    StorageService.commit();
    return newRecipe;
  }
};

const RecipeManager = {
  // PBI 06 & 3NF Rule: Total time is NEVER stored in the database; always calculated dynamically
  calculateTotalTime(prepMin, cookMin) {
    const p = parseInt(prepMin, 10) || 0;
    const c = parseInt(cookMin, 10) || 0;
    return p + c;
  },

  formatIngredientLine(riRow, ingRow) {
    const parts = [];
    if (riRow.quantity !== null && riRow.quantity !== "" && riRow.quantity !== undefined) {
      parts.push(riRow.quantity);
    }
    if (riRow.unit) {
      parts.push(riRow.unit);
    }
    if (ingRow && ingRow.ingredient_name) {
      parts.push(ingRow.ingredient_name);
    }
    return parts.join(" ").trim();
  },

  parseIngredientString(rawLine) {
    const clean = (rawLine || "").trim();
    if (!clean) return null;

    const knownUnits = [
      'lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces',
      'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons',
      'cup', 'cups', 'clove', 'cloves', 'bunch', 'bunches', 'can', 'cans',
      'pinch', 'dash', 'g', 'kg', 'ml', 'l', 'slice', 'slices', 'piece', 'pieces'
    ];

    const match = clean.match(/^(\d+(?:\.\d+)?|\d+\/\d+)?\s*(.*)$/);
    let quantity = null;
    let remainder = clean;

    if (match && match[1]) {
      const qRaw = match[1];
      if (qRaw.includes('/')) {
        const [num, den] = qRaw.split('/').map(Number);
        quantity = den ? Number((num / den).toFixed(2)) : null;
      } else {
        quantity = parseFloat(qRaw);
      }
      remainder = (match[2] || "").trim();
    }

    let unit = "";
    let ingredientName = remainder;

    const words = remainder.split(/\s+/);
    if (words.length > 1 && knownUnits.includes(words[0].toLowerCase().replace(/\./g, ''))) {
      unit = words[0];
      ingredientName = words.slice(1).join(" ").trim();
    }

    if (!ingredientName) {
      ingredientName = clean;
    }

    return { quantity, unit, ingredient_name: ingredientName };
  },

  getHydratedRecipe(recipeId) {
    const id = Number(recipeId);
    const r = StorageService.db.recipe.find(item => item.recipe_id === id);
    if (!r) return null;

    const steps = StorageService.db.step
      .filter(s => s.recipe_id === id)
      .sort((a, b) => a.step_number - b.step_number);

    const recipeIngs = StorageService.db.recipe_ingredient
      .filter(ri => ri.recipe_id === id)
      .sort((a, b) => a.line_order - b.line_order)
      .map(ri => {
        const ing = StorageService.db.ingredient.find(i => i.ingredient_id === ri.ingredient_id);
        return {
          ...ri,
          ingredient_name: ing ? ing.ingredient_name : "",
          formatted: this.formatIngredientLine(ri, ing)
        };
      });

    const tagIds = StorageService.db.recipe_tag
      .filter(rt => rt.recipe_id === id)
      .map(rt => rt.tag_id);

    const tags = StorageService.db.tag.filter(t => tagIds.includes(t.tag_id));

    return {
      ...r,
      total_time_min: this.calculateTotalTime(r.prep_time_min, r.cook_time_min),
      steps,
      ingredients: recipeIngs,
      tags,
      tagIds
    };
  },

  createBlankRecipe() {
    const now = new Date().toISOString();
    const newRecipe = {
      recipe_id: StorageService.nextId('recipe', 'recipe_id'),
      source_idea_id: null,
      recipe_title: "",
      description: "",
      prep_time_min: null,
      cook_time_min: null,
      servings: null,
      difficulty: null,
      personal_notes: "",
      photo_path: "",
      created_at: now,
      updated_at: now
    };
    StorageService.db.recipe.push(newRecipe);
    StorageService.commit();
    return newRecipe;
  },

  duplicateRecipe(recipeId) {
    const source = this.getHydratedRecipe(recipeId);
    if (!source) return null;

    const now = new Date().toISOString();
    const newId = StorageService.nextId('recipe', 'recipe_id');
    const copy = {
      recipe_id: newId,
      source_idea_id: source.source_idea_id,
      recipe_title: `${source.recipe_title || 'Untitled Recipe'} (Copy)`,
      description: source.description,
      prep_time_min: source.prep_time_min,
      cook_time_min: source.cook_time_min,
      servings: source.servings,
      difficulty: source.difficulty,
      personal_notes: source.personal_notes,
      photo_path: source.photo_path,
      created_at: now,
      updated_at: now
    };
    StorageService.db.recipe.push(copy);

    source.ingredients.forEach(ri => {
      StorageService.db.recipe_ingredient.push({
        recipe_id: newId,
        ingredient_id: ri.ingredient_id,
        quantity: ri.quantity,
        unit: ri.unit,
        line_order: ri.line_order
      });
    });

    source.steps.forEach(s => {
      StorageService.db.step.push({
        step_id: StorageService.nextId('step', 'step_id'),
        recipe_id: newId,
        step_number: s.step_number,
        instruction: s.instruction
      });
    });

    source.tagIds.forEach(tagId => {
      StorageService.db.recipe_tag.push({
        recipe_id: newId,
        tag_id: tagId
      });
    });

    StorageService.commit();
    return copy;
  },

  // PBI 09: Autosave every field change immediately
  updateRecipeField(recipeId, fieldName, value) {
    const r = StorageService.db.recipe.find(item => item.recipe_id === Number(recipeId));
    if (!r) return;
    r[fieldName] = value;
    r.updated_at = new Date().toISOString();
    StorageService.commit();
  },

  toggleRecipeTag(recipeId, tagId) {
    const rId = Number(recipeId);
    const tId = Number(tagId);
    const idx = StorageService.db.recipe_tag.findIndex(
      rt => rt.recipe_id === rId && rt.tag_id === tId
    );
    if (idx >= 0) {
      StorageService.db.recipe_tag.splice(idx, 1);
    } else {
      StorageService.db.recipe_tag.push({ recipe_id: rId, tag_id: tId });
    }
    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  addCustomTag(tagName, recipeId = null) {
    const clean = (tagName || "").trim();
    if (!clean) return null;

    let tag = StorageService.db.tag.find(
      t => t.tag_name.toLowerCase() === clean.toLowerCase()
    );

    if (!tag) {
      tag = {
        tag_id: StorageService.nextId('tag', 'tag_id'),
        tag_name: clean,
        is_preset: false
      };
      StorageService.db.tag.push(tag);
    }

    if (recipeId !== null) {
      const exists = StorageService.db.recipe_tag.some(
        rt => rt.recipe_id === Number(recipeId) && rt.tag_id === tag.tag_id
      );
      if (!exists) {
        StorageService.db.recipe_tag.push({
          recipe_id: Number(recipeId),
          tag_id: tag.tag_id
        });
      }
      this.touchRecipeTimestamp(Number(recipeId));
    }

    StorageService.commit();
    return tag;
  },

  addIngredientToRecipe(recipeId, rawLine) {
    const rId = Number(recipeId);
    const parsed = this.parseIngredientString(rawLine);
    if (!parsed) return;

    let ing = StorageService.db.ingredient.find(
      i => i.ingredient_name.toLowerCase() === parsed.ingredient_name.toLowerCase()
    );
    if (!ing) {
      ing = {
        ingredient_id: StorageService.nextId('ingredient', 'ingredient_id'),
        ingredient_name: parsed.ingredient_name
      };
      StorageService.db.ingredient.push(ing);
    }

    const existingLines = StorageService.db.recipe_ingredient.filter(ri => ri.recipe_id === rId);
    const maxOrder = existingLines.length > 0 ? Math.max(...existingLines.map(l => l.line_order)) : 0;

    const existingJunction = StorageService.db.recipe_ingredient.find(
      ri => ri.recipe_id === rId && ri.ingredient_id === ing.ingredient_id
    );

    if (existingJunction) {
      existingJunction.quantity = parsed.quantity;
      existingJunction.unit = parsed.unit;
    } else {
      StorageService.db.recipe_ingredient.push({
        recipe_id: rId,
        ingredient_id: ing.ingredient_id,
        quantity: parsed.quantity,
        unit: parsed.unit,
        line_order: maxOrder + 1
      });
    }

    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  removeIngredientFromRecipe(recipeId, ingredientId) {
    const rId = Number(recipeId);
    const iId = Number(ingredientId);
    StorageService.db.recipe_ingredient = StorageService.db.recipe_ingredient.filter(
      ri => !(ri.recipe_id === rId && ri.ingredient_id === iId)
    );
    StorageService.db.recipe_ingredient
      .filter(ri => ri.recipe_id === rId)
      .sort((a, b) => a.line_order - b.line_order)
      .forEach((ri, index) => {
        ri.line_order = index + 1;
      });

    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  addStepToRecipe(recipeId, instructionText) {
    const rId = Number(recipeId);
    const clean = (instructionText || "").trim();
    if (!clean) return;

    const existingSteps = StorageService.db.step.filter(s => s.recipe_id === rId);
    const nextStepNumber = existingSteps.length + 1;

    StorageService.db.step.push({
      step_id: StorageService.nextId('step', 'step_id'),
      recipe_id: rId,
      step_number: nextStepNumber,
      instruction: clean
    });

    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  updateStepInstruction(stepId, newText) {
    const step = StorageService.db.step.find(s => s.step_id === Number(stepId));
    if (!step) return;
    step.instruction = newText;
    this.touchRecipeTimestamp(step.recipe_id);
    StorageService.commit();
  },

  removeStep(recipeId, stepId) {
    const rId = Number(recipeId);
    const sId = Number(stepId);
    StorageService.db.step = StorageService.db.step.filter(s => s.step_id !== sId);
    StorageService.db.step
      .filter(s => s.recipe_id === rId)
      .sort((a, b) => a.step_number - b.step_number)
      .forEach((s, idx) => {
        s.step_number = idx + 1;
      });

    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  reorderStep(recipeId, fromIndex, toIndex) {
    const rId = Number(recipeId);
    const steps = StorageService.db.step
      .filter(s => s.recipe_id === rId)
      .sort((a, b) => a.step_number - b.step_number);

    if (fromIndex < 0 || toIndex < 0 || fromIndex >= steps.length || toIndex >= steps.length) {
      return;
    }

    const [moved] = steps.splice(fromIndex, 1);
    steps.splice(toIndex, 0, moved);

    steps.forEach((s, idx) => {
      s.step_number = idx + 1;
    });

    this.touchRecipeTimestamp(rId);
    StorageService.commit();
  },

  deleteRecipe(recipeId) {
    const rId = Number(recipeId);
    StorageService.db.recipe = StorageService.db.recipe.filter(r => r.recipe_id !== rId);
    StorageService.db.step = StorageService.db.step.filter(s => s.recipe_id !== rId);
    StorageService.db.recipe_ingredient = StorageService.db.recipe_ingredient.filter(ri => ri.recipe_id !== rId);
    StorageService.db.recipe_tag = StorageService.db.recipe_tag.filter(rt => rt.recipe_id !== rId);
    StorageService.commit();
  },

  touchRecipeTimestamp(recipeId) {
    const r = StorageService.db.recipe.find(item => item.recipe_id === Number(recipeId));
    if (r) r.updated_at = new Date().toISOString();
  }
};

const SearchAndFilter = {
  findRecipes(queryText = "", activeTagId = null) {
    const q = (queryText || "").trim().toLowerCase();
    const allRecipes = StorageService.db.recipe.map(r => RecipeManager.getHydratedRecipe(r.recipe_id));

    return allRecipes
      .filter(recipe => {
        if (activeTagId !== null && !recipe.tagIds.includes(Number(activeTagId))) {
          return false;
        }
        if (!q) return true;
        const titleMatch = (recipe.recipe_title || "").toLowerCase().includes(q);
        const descMatch = (recipe.description || "").toLowerCase().includes(q);
        const notesMatch = (recipe.personal_notes || "").toLowerCase().includes(q);
        const ingMatch = recipe.ingredients.some(
          ing => ing.ingredient_name.toLowerCase().includes(q) || ing.formatted.toLowerCase().includes(q)
        );
        const tagMatch = recipe.tags.some(t => t.tag_name.toLowerCase().includes(q));
        return titleMatch || descMatch || notesMatch || ingMatch || tagMatch;
      })
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
};

/*************************************************************************
 * LAYER 3: FULL-WIDTH WEB UI LAYER + DEMO LOGIN CONTROLLER
 *************************************************************************/
const UI = {
  currentView: 'recipes',       // 'recipes' | 'ideas' | 'editor' | 'recipe-view'
  activeRecipeId: 1,
  activeIdeaId: null,
  isNewRecipeMode: false,
  searchQuery: '',
  selectedTagFilterId: null,
  largeTextEnabled: false,
  draggedStepIndex: null,

  init() {
    StorageService.init();
    if (StorageService.db.recipe.length > 0) {
      this.activeRecipeId = StorageService.db.recipe[0].recipe_id;
    }
    this.renderAuthHeader();
    this.updateNavBadges();
    this.render();
  },

  esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /* =====================================================================
   * DEMO LOG IN & ACCOUNT SWITCHER HANDLERS
   * ===================================================================== */
  renderAuthHeader() {
    const slot = document.getElementById('auth-header-slot');
    if (!slot) return;
    const user = StorageService.currentUser;

    if (!user) {
      slot.innerHTML = `
        <button type="button" onclick="UI.openAuthModal()" class="btn-secondary !min-h-[40px] sm:!min-h-[42px] !py-1.5 !px-3.5 !text-sm">
          Demo Log In
        </button>
      `;
      return;
    }

    slot.innerHTML = `
      <button type="button" onclick="UI.openAuthModal()"
              class="px-3 py-1.5 rounded-full border border-stone-300 bg-white/90 hover:bg-white text-xs sm:text-sm font-medium text-ink min-h-[40px] sm:min-h-[42px] flex items-center gap-2 transition"
              title="Signed in as ${this.esc(user.email)}. Click to open Demo Log In.">
        <span class="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
              style="background-color: ${user.badgeColor || '#C2410C'}">
          ${this.esc(user.initials)}
        </span>
        <span class="hidden md:inline">${this.esc(user.name)}</span>
      </button>
    `;
  },

  openAuthModal() {
    const modal = document.getElementById('auth-modal');
    const statusEl = document.getElementById('login-status-msg');
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.classList.add('hidden');
    }
    if (modal) modal.classList.remove('hidden');
  },

  closeAuthModal() {
    document.getElementById('auth-modal')?.classList.add('hidden');
  },

  // Prefills Jordan's predetermined demo credentials and signs in smoothly
  triggerDemoPrefill() {
    this.runPrefillSequence(DEMO_ACCOUNTS.jordan);
  },

  // Prefills Doris's predetermined demo credentials for family-cook walkthrough
  triggerDorisDemoPrefill() {
    this.runPrefillSequence(DEMO_ACCOUNTS.doris);
  },

  runPrefillSequence(account) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const statusEl = document.getElementById('login-status-msg');

    if (emailInput) emailInput.value = account.email;
    if (passInput) passInput.value = account.password;
    if (statusEl) {
      statusEl.textContent = `Prefilled demo credentials for ${account.name}...`;
      statusEl.className = 'text-small text-tagGreen font-medium';
      statusEl.classList.remove('hidden');
    }

    // Brief 500ms pause so live presentation viewers see the fields prefill
    setTimeout(() => {
      this.completeDemoSignIn(account);
    }, 500);
  },

  handleCredentialLogin(event) {
    event.preventDefault();
    const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
    const pass = document.getElementById('login-password')?.value || '';
    const statusEl = document.getElementById('login-status-msg');

    if (email === DEMO_ACCOUNTS.jordan.email && pass === DEMO_ACCOUNTS.jordan.password) {
      this.completeDemoSignIn(DEMO_ACCOUNTS.jordan);
      return;
    }
    if (email === DEMO_ACCOUNTS.doris.email && pass === DEMO_ACCOUNTS.doris.password) {
      this.completeDemoSignIn(DEMO_ACCOUNTS.doris);
      return;
    }

    if (statusEl) {
      statusEl.textContent = 'Invalid email or password. Click "Demo Log In" above to prefill our demo credentials.';
      statusEl.className = 'text-small text-danger font-medium';
      statusEl.classList.remove('hidden');
    }
  },

  completeDemoSignIn(account) {
    StorageService.setActiveUser(account);
    if (StorageService.db.recipe.length > 0) {
      this.activeRecipeId = StorageService.db.recipe[0].recipe_id;
    }
    this.selectedTagFilterId = null;
    this.searchQuery = '';
    this.closeAuthModal();
    this.renderAuthHeader();
    this.switchTab('recipes');
  },

  updateNavBadges() {
    // Number badges omitted per clean header layout
  },

  updateNavActiveStyles() {
    const activeTab = (this.currentView === 'ideas') ? 'ideas' : 'recipes';
    const rTab = document.getElementById('nav-tab-recipes');
    const iTab = document.getElementById('nav-tab-ideas');

    if (rTab) {
      rTab.className = activeTab === 'recipes'
        ? "px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm sm:text-base transition flex items-center gap-2 bg-primary text-white shadow-sm"
        : "px-3 sm:px-4 py-2 rounded-xl font-medium text-sm sm:text-base transition flex items-center gap-2 text-ink hover:bg-stone-200/60";
    }
    if (iTab) {
      iTab.className = activeTab === 'ideas'
        ? "px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm sm:text-base transition flex items-center gap-2 bg-primary text-white shadow-sm"
        : "px-3 sm:px-4 py-2 rounded-xl font-medium text-sm sm:text-base transition flex items-center gap-2 text-ink hover:bg-stone-200/60";
    }
  },

  toggleLargeText() {
    this.largeTextEnabled = !this.largeTextEnabled;
    document.body.classList.toggle('large-text-mode', this.largeTextEnabled);
    const btn = document.getElementById('btn-large-text');
    if (btn) {
      btn.classList.toggle('border-primary', this.largeTextEnabled);
      btn.classList.toggle('text-primary', this.largeTextEnabled);
    }
  },

  notifyAutosave() {
    document.querySelectorAll('.autosave-indicator').forEach(el => {
      el.textContent = 'Saved automatically';
      el.classList.remove('autosave-flash');
      void el.offsetWidth;
      el.classList.add('autosave-flash');
    });
  },

  switchTab(tabName) {
    this.currentView = tabName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openRecipeEditor(recipeId, isNew = false) {
    this.activeRecipeId = Number(recipeId);
    this.isNewRecipeMode = isNew;
    this.currentView = 'editor';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openRecipeView(recipeId) {
    this.activeRecipeId = Number(recipeId);
    this.isNewRecipeMode = false;
    this.currentView = 'recipe-view';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  startNewBlankRecipe() {
    const r = RecipeManager.createBlankRecipe();
    this.openRecipeEditor(r.recipe_id, true);
  },

  handleTurnIdeaIntoRecipe(ideaId) {
    const newRecipe = IdeasManager.turnIdeaIntoRecipe(ideaId);
    if (newRecipe) {
      this.openRecipeEditor(newRecipe.recipe_id, true);
    }
  },

  render() {
    this.updateNavActiveStyles();
    const workspace = document.getElementById('app-workspace');
    if (!workspace) return;

    if (this.currentView === 'editor') {
      workspace.innerHTML = this.buildRecipeEditorCardHTML(this.activeRecipeId);
      return;
    }

    if (this.currentView === 'recipe-view') {
      workspace.innerHTML = this.buildRecipeDetailCardHTML(this.activeRecipeId);
      return;
    }

    if (this.currentView === 'ideas') {
      workspace.innerHTML = this.buildIdeasListColumnHTML();
      return;
    }

    workspace.innerHTML = this.buildRecipesListColumnHTML();
  },

  /* =====================================================================
   * VIEW 1: FULL-SCREEN DESKTOP RECIPES DIRECTORY
   * ===================================================================== */
  buildRecipesListColumnHTML() {
    const allTags = StorageService.db.tag;
    const matchingRecipes = SearchAndFilter.findRecipes(this.searchQuery, this.selectedTagFilterId);
    const ownerName = StorageService.currentUser ? StorageService.currentUser.name : 'My';

    return `
      <div class="space-y-8">
        <!-- Top Row: Page Heading & Search Bar side-by-side on desktop -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-300/80">
          <div>
            <h1 class="text-heading !text-3xl">${this.esc(ownerName)}'s Recipes</h1>
            <p class="text-small mt-1">Search by keyword, ingredient, or tag across your personal cookbook</p>
          </div>

          <!-- Search Input & Mobile New Recipe Button -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div class="relative w-full sm:w-96">
              <input id="recipe-search-input" type="text" 
                     class="recipme-input pr-10" 
                     placeholder="Search recipes or ingredients (e.g., lime, gumbo)..."
                     value="${this.esc(this.searchQuery)}"
                     oninput="UI.handleSearchInput(this.value)">
              ${this.searchQuery ? `
                <button onclick="UI.handleSearchInput('')" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1"
                        title="Clear search">
                  ✕
                </button>
              ` : ''}
            </div>
            <button onclick="UI.startNewBlankRecipe()" class="btn-main sm:hidden">
              + New recipe
            </button>
          </div>
        </div>

        <!-- Open Choice Chip Tag Filter Bar -->
        <div class="flex flex-wrap items-center gap-2.5">
          <span class="text-small mr-2 font-medium">Filter by tag:</span>
          <button onclick="UI.selectTagFilter(null)" 
                  class="chip ${this.selectedTagFilterId === null ? 'selected' : ''}">
            ${this.selectedTagFilterId === null ? '<span>✓</span>' : ''}
            <span>All Recipes</span>
          </button>
          ${allTags.map(tag => {
            const isSelected = this.selectedTagFilterId === tag.tag_id;
            return `
              <button onclick="UI.selectTagFilter(${tag.tag_id})" 
                      class="chip ${isSelected ? 'selected' : ''}">
                ${isSelected ? '<span>✓</span>' : ''}
                <span>${this.esc(tag.tag_name)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Multi-Column Responsive Recipe Grid -->
        ${matchingRecipes.length === 0 ? `
          <div class="py-16 text-center border-t border-b border-stone-300/70">
            <p class="text-heading mb-2">No recipes match your search</p>
            <p class="text-small mb-6">Try another keyword or clear the active tag filter.</p>
            <button onclick="UI.resetFilters()" class="btn-secondary">
              Show all recipes
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pt-2">
            ${matchingRecipes.map(r => `
              <article onclick="UI.openRecipeView(${r.recipe_id})" 
                       class="group cursor-pointer flex flex-col justify-between border-t-2 border-stone-800/80 hover:border-primary pt-5 transition-all">
                <div>
                  ${r.photo_path ? `
                    <div class="mb-4 rounded-xl overflow-hidden bg-stone-200 aspect-[16/10]">
                      <img src="${this.esc(r.photo_path)}" alt="${this.esc(r.recipe_title)}" 
                           class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                           onerror="this.parentElement.style.display='none'">
                    </div>
                  ` : ''}

                  <div class="flex items-start justify-between gap-3">
                    <h2 class="text-heading group-hover:text-primary transition-colors">
                      ${this.esc(r.recipe_title || 'Untitled recipe')}
                    </h2>
                    <span class="text-small shrink-0 font-medium text-primary">Open →</span>
                  </div>

                  ${r.description ? `
                    <p class="text-body text-stone-700 mt-2 line-clamp-3">
                      ${this.esc(r.description)}
                    </p>
                  ` : ''}
                </div>

                <div class="mt-5 pt-3 border-t border-stone-300/60 space-y-3">
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-small">
                    <span>Total: <strong class="text-ink">${r.total_time_min || 0} min</strong></span>
                    ${r.servings ? `<span>• Servings: <strong class="text-ink">${r.servings}</strong></span>` : ''}
                    ${r.difficulty ? `<span>• Difficulty: <strong class="text-ink">${r.difficulty}/5</strong></span>` : ''}
                  </div>

                  ${r.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-1.5">
                      ${r.tags.map(t => `
                        <span class="px-3 py-0.5 rounded-full text-xs font-medium bg-tagGreen text-white">
                          ✓ ${this.esc(t.tag_name)}
                        </span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </article>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  handleSearchInput(val) {
    this.searchQuery = val;
    this.render();
    const input = document.getElementById('recipe-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  },

  selectTagFilter(tagId) {
    if (tagId === null) {
      this.selectedTagFilterId = null;
    } else {
      this.selectedTagFilterId = this.selectedTagFilterId === tagId ? null : tagId;
    }
    this.render();
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedTagFilterId = null;
    this.render();
  },

  /* =====================================================================
   * VIEW 2: FULL-SCREEN DESKTOP IDEAS WORKSPACE
   * ===================================================================== */
  buildIdeasListColumnHTML() {
    const ideas = IdeasManager.getAllIdeas();

    return `
      <div class="space-y-10">
        <div class="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-stone-300/80">
          <div>
            <h1 class="text-heading !text-3xl">Cooking Ideas</h1>
            <p class="text-small mt-1">Click any idea title to view or edit its note, or turn it into a recipe</p>
          </div>
          <span class="autosave-indicator text-small">Saved automatically</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <!-- Left Column: Open Quick Capture Form -->
          <div class="lg:col-span-4 space-y-4 lg:sticky lg:top-28 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-stone-300/70 lg:pr-8">
            <h2 class="text-heading">Save a new idea</h2>
            <div>
              <label for="new-idea-title" class="text-small block mb-1">Idea title</label>
              <input id="new-idea-title" type="text" class="recipme-input" 
                     placeholder="e.g., Honey chipotle chicken">
            </div>
            <div>
              <label for="new-idea-note" class="text-small block mb-1">Idea note (copied into recipe description)</label>
              <textarea id="new-idea-note" rows="3" class="recipme-input"
                        placeholder="e.g., Try with lime and garlic, maybe over rice."></textarea>
            </div>
            <button onclick="UI.handleSaveNewIdea()" class="btn-main w-full">
              Save idea
            </button>
          </div>

          <!-- Right Column: Saved Ideas (Title only until clicked) -->
          <div class="lg:col-span-8 divide-y divide-stone-300/80 border-t border-b border-stone-300/80">
            ${ideas.length === 0 ? `
              <div class="py-12 text-center">
                <p class="text-body text-muted">No cooking ideas saved yet. Add your first idea on the left!</p>
              </div>
            ` : ideas.map(idea => {
              const isExpanded = this.activeIdeaId === idea.idea_id;
              return `
                <div class="py-5 transition-all">
                  <div class="flex items-center justify-between gap-4">
                    <button type="button"
                            onclick="UI.toggleIdeaNote(${idea.idea_id})"
                            class="flex-1 text-left flex items-center justify-between gap-4 group py-1 focus:outline-none">
                      <span class="text-heading group-hover:text-primary transition-colors">
                        ${this.esc(idea.idea_title || 'Untitled idea')}
                      </span>
                      <span class="text-small text-primary font-medium shrink-0">
                        ${isExpanded ? 'Close note ▲' : 'View note ▼'}
                      </span>
                    </button>

                    <!-- Kebab ⋮ Menu -->
                    <div class="relative shrink-0">
                      <button onclick="UI.toggleIdeaMenu(${idea.idea_id})" 
                              class="btn-icon" 
                              title="Idea menu">
                        <span class="font-bold text-xl leading-none">⋮</span>
                      </button>
                      <div id="idea-menu-${idea.idea_id}" 
                           class="hidden absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                        <button onclick="UI.handleTurnIdeaIntoRecipe(${idea.idea_id})" 
                                class="w-full text-left px-4 py-2.5 text-body hover:bg-gray-50 font-medium text-primary">
                          Turn into Recipe
                        </button>
                        <button onclick="UI.openDeleteIdeaModal(${idea.idea_id})" 
                                class="w-full text-left px-4 py-2.5 text-body hover:bg-red-50 text-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  ${isExpanded ? `
                    <div class="mt-5 pt-4 border-t border-stone-300/60 space-y-4">
                      <div>
                        <label class="text-small block mb-1">Idea title</label>
                        <input type="text" 
                               value="${this.esc(idea.idea_title)}"
                               aria-label="Idea title"
                               oninput="IdeasManager.updateIdea(${idea.idea_id}, { idea_title: this.value })"
                               class="recipme-input font-semibold">
                      </div>
                      <div>
                        <label class="text-small block mb-1">Idea note</label>
                        <textarea rows="3"
                                  aria-label="Idea note"
                                  oninput="IdeasManager.updateIdea(${idea.idea_id}, { idea_note: this.value })"
                                  class="recipme-input">${this.esc(idea.idea_note)}</textarea>
                      </div>
                      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <span class="text-small">Automatically copies title & note into a new recipe</span>
                        <button onclick="UI.handleTurnIdeaIntoRecipe(${idea.idea_id})" 
                                class="btn-main !min-h-[42px] !py-2 !px-5">
                          Turn into Recipe →
                        </button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

        </div>
      </div>
    `;
  },

  toggleIdeaNote(ideaId) {
    const id = Number(ideaId);
    this.activeIdeaId = (this.activeIdeaId === id) ? null : id;
    this.render();
  },

  handleSaveNewIdea() {
    const titleInput = document.getElementById('new-idea-title');
    const noteInput = document.getElementById('new-idea-note');
    const titleVal = titleInput ? titleInput.value.trim() : '';
    const noteVal = noteInput ? noteInput.value.trim() : '';
    if (!titleVal && !noteVal) return;

    IdeasManager.createIdea(noteVal || titleVal, titleVal);
    if (titleInput) titleInput.value = '';
    if (noteInput) noteInput.value = '';
    this.render();
  },

  toggleIdeaMenu(ideaId) {
    const menu = document.getElementById(`idea-menu-${ideaId}`);
    if (menu) menu.classList.toggle('hidden');
  },

  /* =====================================================================
   * 3NF DATABASE & SQLITE MODAL
   * ===================================================================== */
  openDatabaseModal() {
    const modal = document.getElementById('db-modal');
    const body = document.getElementById('db-modal-body');
    if (!modal || !body) return;
    body.innerHTML = this.buildDatabaseInspectorHTML();
    modal.classList.remove('hidden');
  },

  closeDatabaseModal() {
    document.getElementById('db-modal')?.classList.add('hidden');
  },

  buildDatabaseInspectorHTML() {
    const tables = [
      { name: 'idea', pk: 'PK: idea_id', desc: 'Quick cooking ideas saved in the Ideas list before they become recipes.' },
      { name: 'recipe', pk: 'PK: recipe_id | FK: source_idea_id', desc: 'Finished recipes in the notebook. Total time is NOT stored (calculated dynamically as prep_time_min + cook_time_min for 3NF).' },
      { name: 'step', pk: 'PK: step_id | FK: recipe_id', desc: 'Numbered "How to Make It" instructions; step_number updates on drag reorder.' },
      { name: 'ingredient', pk: 'PK: ingredient_id', desc: 'Unique ingredient names stored once so recipes can be searched by ingredient.' },
      { name: 'recipe_ingredient', pk: 'PK, FK: (recipe_id, ingredient_id)', desc: 'Junction table linking recipes and ingredients with quantity, unit, and line_order.' },
      { name: 'tag', pk: 'PK: tag_id', desc: 'Labels used to group and filter recipes (is_preset = true for built-in tags).' },
      { name: 'recipe_tag', pk: 'PK, FK: (recipe_id, tag_id)', desc: 'Junction table linking recipes and tags (many-to-many).' }
    ];

    const sqlDump = StorageService.generateSQLiteDump();

    return `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-small">Live local SQLite state across all 7 normalized tables:</span>
          <div class="flex flex-wrap items-center gap-2.5">
            <button onclick="UI.downloadSQLiteFile()" class="btn-main !min-h-[40px] !py-1.5 !px-4 !text-sm">
              ⬇ Download schema.sql
            </button>
            <button onclick="UI.copySQLiteToClipboard()" class="btn-secondary !min-h-[40px] !py-1.5 !px-4 !text-sm">
              <span id="copy-sql-label">Copy SQL Script</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${tables.map(t => {
            const rows = StorageService.db[t.name] || [];
            return `
              <div class="bg-cream/50 rounded-xl border border-gray-200 p-4 flex flex-col">
                <div class="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200">
                  <span class="font-bold text-body text-ink">Table: <code class="text-primary">${t.name}</code> (${rows.length})</span>
                  <span class="text-xs font-mono text-muted">${t.pk}</span>
                </div>
                <p class="text-small my-2">${t.desc}</p>
                <pre class="bg-white rounded-lg p-3 border border-gray-200 overflow-x-auto text-xs font-mono text-gray-800 max-h-44 leading-relaxed">${this.esc(JSON.stringify(rows, null, 2))}</pre>
              </div>
            `;
          }).join('')}
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-body">Generated SQLite DDL & INSERT Script (<code>recipme_3nf_schema.sql</code>)</h4>
          </div>
          <textarea id="sqlite-dump-textarea" readonly rows="10" 
                    class="w-full font-mono text-xs bg-gray-900 text-green-400 p-4 rounded-xl border border-gray-700 focus:outline-none">${this.esc(sqlDump)}</textarea>
        </div>
      </div>
    `;
  },

  downloadSQLiteFile() {
    const sqlDump = StorageService.generateSQLiteDump();
    const blob = new Blob([sqlDump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipme_3nf_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  copySQLiteToClipboard() {
    const textarea = document.getElementById('sqlite-dump-textarea');
    if (!textarea) return;
    textarea.select();
    document.execCommand('copy');
    const label = document.getElementById('copy-sql-label');
    if (label) {
      label.textContent = '✓ Copied SQL!';
      setTimeout(() => { label.textContent = 'Copy SQL Script'; }, 2000);
    }
  },

  /* =====================================================================
   * VIEW 3: FULL-WIDTH DESKTOP RECIPE EDITOR
   * ===================================================================== */
  buildRecipeEditorCardHTML(recipeId) {
    const recipe = RecipeManager.getHydratedRecipe(recipeId);
    if (!recipe) {
      return `<p class="text-body">Recipe not found.</p>`;
    }
    const allTags = StorageService.db.tag;
    const headingTitle = this.isNewRecipeMode ? 'New recipe' : 'Edit recipe';

    return `
      <div class="space-y-6 sm:space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-stone-300/80">
          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <button type="button" onclick="UI.switchTab('recipes')" class="btn-secondary !px-3.5 sm:!px-4 !py-2 shrink-0">
              <span>←</span>
              <span>Recipes</span>
            </button>
            <h1 class="text-heading !text-xl sm:!text-3xl truncate">${headingTitle}</h1>
          </div>

          <div class="flex items-center gap-2.5 sm:gap-4 ml-auto">
            <span class="autosave-indicator text-small">Saved automatically</span>

            <div class="relative">
              <button type="button" onclick="UI.toggleEditorMenu()" class="btn-icon" title="Recipe menu">
                <span class="font-bold text-xl leading-none">⋮</span>
              </button>
              <div id="editor-kebab-menu" class="hidden absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-30">
                <button type="button" onclick="UI.openRecipeView(${recipe.recipe_id})" class="w-full text-left px-4 py-2.5 text-body hover:bg-gray-50">
                  View Recipe
                </button>
                <button type="button" onclick="UI.handleDuplicateRecipe(${recipe.recipe_id})" class="w-full text-left px-4 py-2.5 text-body hover:bg-gray-50">
                  Duplicate
                </button>
                <hr class="my-1 border-gray-100">
                <button type="button" onclick="UI.openDeleteRecipeModal(${recipe.recipe_id})" class="w-full text-left px-4 py-2.5 text-body hover:bg-red-50 text-danger font-medium">
                  Delete
                </button>
              </div>
            </div>

            <button type="button" onclick="UI.openRecipeView(${recipe.recipe_id})" class="btn-main !min-h-[44px] !py-2 !px-6 hidden sm:inline-flex">
              Done
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <!-- LEFT COLUMN -->
          <div class="lg:col-span-5 space-y-6">
            <div class="space-y-4">
              <div>
                <label for="field-recipe-title" class="text-small block mb-1">Recipe title</label>
                <input id="field-recipe-title" type="text" 
                       class="recipme-input font-semibold" 
                       placeholder="e.g., Honey chipotle chicken"
                       value="${this.esc(recipe.recipe_title)}"
                       oninput="RecipeManager.updateRecipeField(${recipe.recipe_id}, 'recipe_title', this.value)">
              </div>

              <div>
                <label for="field-recipe-desc" class="text-small block mb-1">Description</label>
                <textarea id="field-recipe-desc" rows="3" 
                          class="recipme-input"
                          placeholder="Short description or notes..."
                          oninput="RecipeManager.updateRecipeField(${recipe.recipe_id}, 'description', this.value)">${this.esc(recipe.description)}</textarea>
                ${recipe.source_idea_id ? `
                  <p class="text-small mt-1">Copied from your idea</p>
                ` : ''}
              </div>
            </div>

            <div class="pt-2 border-t border-stone-300/60">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label for="field-prep-time" class="text-small block mb-1">Prep time</label>
                  <div class="relative">
                    <input id="field-prep-time" type="number" min="0" inputmode="numeric"
                           class="recipme-input pr-12" 
                           placeholder="15"
                           value="${recipe.prep_time_min !== null ? recipe.prep_time_min : ''}"
                           oninput="UI.handleTimeChange(${recipe.recipe_id}, 'prep_time_min', this.value)">
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-small pointer-events-none">min</span>
                  </div>
                </div>

                <div>
                  <label for="field-cook-time" class="text-small block mb-1">Cook time</label>
                  <div class="relative">
                    <input id="field-cook-time" type="number" min="0" inputmode="numeric"
                           class="recipme-input pr-12" 
                           placeholder="20"
                           value="${recipe.cook_time_min !== null ? recipe.cook_time_min : ''}"
                           oninput="UI.handleTimeChange(${recipe.recipe_id}, 'cook_time_min', this.value)">
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-small pointer-events-none">min</span>
                  </div>
                </div>

                <div class="col-span-2 sm:col-span-1">
                  <label for="field-servings" class="text-small block mb-1">Servings</label>
                  <input id="field-servings" type="number" min="1" inputmode="numeric"
                         class="recipme-input" 
                         placeholder="4"
                         value="${recipe.servings !== null ? recipe.servings : ''}"
                         oninput="RecipeManager.updateRecipeField(${recipe.recipe_id}, 'servings', this.value ? parseInt(this.value, 10) : null)">
                </div>
              </div>
              <p id="total-time-display" class="text-small mt-2">
                Total time: ${recipe.total_time_min} min
              </p>
            </div>

            <div class="pt-2 border-t border-stone-300/60">
              <label class="text-small block mb-2">Difficulty (1 = Easy, 5 = Hard)</label>
              <div class="flex flex-wrap items-center gap-3">
                ${[1, 2, 3, 4, 5].map(num => {
                  const isSelected = Number(recipe.difficulty) === num;
                  return `
                    <button type="button"
                            onclick="UI.handleDifficultySelect(${recipe.recipe_id}, ${num})"
                            class="chip-difficulty ${isSelected ? 'selected' : ''}">
                      ${num}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="pt-2 border-t border-stone-300/60">
              <label class="text-small block mb-2">Tags</label>
              <div class="flex flex-wrap gap-2">
                ${allTags.map(tag => {
                  const isSelected = recipe.tagIds.includes(tag.tag_id);
                  return `
                    <button type="button"
                            onclick="UI.handleToggleRecipeTag(${recipe.recipe_id}, ${tag.tag_id})"
                            class="chip ${isSelected ? 'selected' : ''}">
                      ${isSelected ? '<span>✓</span>' : ''}
                      <span>${this.esc(tag.tag_name)}</span>
                    </button>
                  `;
                }).join('')}

                <button type="button"
                        onclick="UI.showNewTagInput()"
                        class="chip border-dashed">
                  + New tag
                </button>
              </div>

              <div id="new-tag-form" class="hidden mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input id="new-tag-input" type="text" class="recipme-input !py-2 flex-1" 
                       placeholder="Type new tag (e.g., Quick, Spicy)..."
                       onkeydown="if(event.key==='Enter'){event.preventDefault();UI.handleCreateNewTag(${recipe.recipe_id});}">
                <button type="button" onclick="UI.handleCreateNewTag(${recipe.recipe_id})" class="btn-main !min-h-[44px] !py-2 !px-5 shrink-0">
                  Add
                </button>
              </div>
            </div>

            <div class="space-y-5 pt-4 border-t border-stone-300/60">
              <div>
                <label for="field-personal-notes" class="text-heading !text-[18px] block mb-1">Personal Notes</label>
                <p class="text-small mb-2">Your own cooking tips (e.g., "Stir the whole time. Don't walk away.")</p>
                <textarea id="field-personal-notes" rows="2" 
                          class="recipme-input"
                          placeholder="Add your own family tips or reminders..."
                          oninput="RecipeManager.updateRecipeField(${recipe.recipe_id}, 'personal_notes', this.value)">${this.esc(recipe.personal_notes)}</textarea>
              </div>

              <div>
                <label class="text-heading !text-[18px] block mb-2">Finished Dish Photo</label>
                ${recipe.photo_path ? `
                  <div class="relative rounded-xl overflow-hidden border border-stone-300 mb-3">
                    <img src="${this.esc(recipe.photo_path)}" alt="Finished dish" class="w-full h-52 object-cover">
                    <button type="button" 
                            onclick="UI.handleRemovePhoto(${recipe.recipe_id})"
                            class="absolute top-3 right-3 bg-white/95 text-danger px-3 py-1.5 rounded-lg text-xs font-semibold shadow">
                      Remove Photo
                    </button>
                  </div>
                ` : ''}
                <div class="flex flex-wrap items-center gap-2.5">
                  <label class="btn-secondary cursor-pointer">
                    <span>📷 + Add Photo</span>
                    <input type="file" accept="image/*" class="hidden" onchange="UI.handlePhotoUpload(event, ${recipe.recipe_id})">
                  </label>
                  ${!recipe.photo_path ? `
                    <button type="button" onclick="UI.handleSamplePhoto(${recipe.recipe_id})" class="btn-secondary !text-sm text-muted">
                      Use Sample Dish Photo
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="lg:col-span-7 space-y-8 sm:space-y-10 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-300/70 lg:pl-12">
            
            <div class="space-y-4">
              <h2 class="text-heading">Ingredients</h2>
              
              ${recipe.ingredients.length === 0 ? `
                <p class="text-small py-2">No ingredients added yet. Type an ingredient below.</p>
              ` : `
                <ul class="divide-y divide-stone-300/70 border-t border-b border-stone-300/70">
                  ${recipe.ingredients.map(ing => `
                    <li class="py-3 flex items-center justify-between gap-3">
                      <span class="text-body flex-1 min-w-0">${this.esc(ing.formatted)}</span>
                      <button type="button"
                              onclick="UI.handleRemoveIngredient(${recipe.recipe_id}, ${ing.ingredient_id})"
                              class="w-10 h-10 shrink-0 rounded-lg text-muted hover:text-danger hover:bg-stone-200/60 flex items-center justify-center text-xl"
                              title="Remove ingredient">
                        ×
                      </button>
                    </li>
                  `).join('')}
                </ul>
              `}

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <input id="add-ingredient-input" type="text" 
                       class="recipme-input flex-1"
                       placeholder="Type amount and ingredient (e.g., 2 lb chicken thighs)"
                       onkeydown="if(event.key==='Enter'){event.preventDefault();UI.handleAddIngredient(${recipe.recipe_id});}">
                <button type="button" 
                        onclick="UI.handleAddIngredient(${recipe.recipe_id})" 
                        class="btn-secondary shrink-0">
                  + Add ingredient
                </button>
              </div>
            </div>

            <div class="space-y-4 pt-6 border-t border-stone-300/70">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h2 class="text-heading">How to Make It</h2>
                <span class="text-small">Drag steps or use ▲/▼ to reorder</span>
              </div>

              <div id="steps-list" class="divide-y divide-stone-300/70 border-t border-b border-stone-300/70">
                ${recipe.steps.length === 0 ? `
                  <p class="text-small py-4">No steps added yet. Add your first step below.</p>
                ` : recipe.steps.map((step, idx) => `
                  <div draggable="true"
                       ondragstart="UI.onStepDragStart(event, ${idx})"
                       ondragover="UI.onStepDragOver(event)"
                       ondrop="UI.onStepDrop(event, ${recipe.recipe_id}, ${idx})"
                       class="flex items-start gap-2.5 sm:gap-3 py-3.5">
                    <span class="font-bold text-body min-w-[26px] pt-2 text-primary select-none cursor-grab shrink-0" title="Drag to reorder">
                      ${step.step_number}.
                    </span>
                    <textarea rows="2"
                              oninput="RecipeManager.updateStepInstruction(${step.step_id}, this.value)"
                              class="flex-1 min-w-0 recipme-input resize-none">${this.esc(step.instruction)}</textarea>
                    <div class="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                      <button type="button" 
                              onclick="UI.moveStep(${recipe.recipe_id}, ${idx}, ${idx - 1})"
                              ${idx === 0 ? 'disabled class="opacity-25 pointer-events-none text-xs p-1.5"' : 'class="text-xs p-1.5 rounded hover:bg-stone-200/70 text-muted"'}
                              title="Move step up">▲</button>
                      <button type="button" 
                              onclick="UI.moveStep(${recipe.recipe_id}, ${idx}, ${idx + 1})"
                              ${idx === recipe.steps.length - 1 ? 'disabled class="opacity-25 pointer-events-none text-xs p-1.5"' : 'class="text-xs p-1.5 rounded hover:bg-stone-200/70 text-muted"'}
                              title="Move step down">▼</button>
                      <button type="button"
                              onclick="UI.handleRemoveStep(${recipe.recipe_id}, ${step.step_id})"
                              class="text-muted hover:text-danger text-lg px-2 py-0.5"
                              title="Remove step">×</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <input id="add-step-input" type="text" 
                       class="recipme-input flex-1"
                       placeholder="Type next step (e.g., Marinate the chicken for 10 minutes.)"
                       onkeydown="if(event.key==='Enter'){event.preventDefault();UI.handleAddStep(${recipe.recipe_id});}">
                <button type="button" 
                        onclick="UI.handleAddStep(${recipe.recipe_id})" 
                        class="btn-secondary shrink-0">
                  + Add step
                </button>
              </div>
            </div>

            <div class="pt-6 border-t border-stone-300/70 flex justify-end">
              <button type="button" onclick="UI.openRecipeView(${recipe.recipe_id})" class="btn-main w-full sm:w-auto sm:min-w-[220px]">
                Done
              </button>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  toggleEditorMenu() {
    const menu = document.getElementById('editor-kebab-menu');
    if (menu) menu.classList.toggle('hidden');
  },

  handleTimeChange(recipeId, fieldName, rawVal) {
    const num = rawVal !== '' ? Math.max(0, parseInt(rawVal, 10) || 0) : null;
    RecipeManager.updateRecipeField(recipeId, fieldName, num);
    const r = RecipeManager.getHydratedRecipe(recipeId);
    const totalEl = document.getElementById('total-time-display');
    if (totalEl && r) {
      totalEl.textContent = `Total time: ${r.total_time_min} min`;
    }
  },

  handleDifficultySelect(recipeId, rating) {
    const r = StorageService.db.recipe.find(item => item.recipe_id === Number(recipeId));
    const nextVal = r && r.difficulty === rating ? null : rating;
    RecipeManager.updateRecipeField(recipeId, 'difficulty', nextVal);
    this.render();
  },

  handleToggleRecipeTag(recipeId, tagId) {
    RecipeManager.toggleRecipeTag(recipeId, tagId);
    this.render();
  },

  showNewTagInput() {
    const form = document.getElementById('new-tag-form');
    const input = document.getElementById('new-tag-input');
    if (form) {
      form.classList.toggle('hidden');
      if (!form.classList.contains('hidden') && input) input.focus();
    }
  },

  handleCreateNewTag(recipeId) {
    const input = document.getElementById('new-tag-input');
    if (!input || !input.value.trim()) return;
    RecipeManager.addCustomTag(input.value.trim(), recipeId);
    this.render();
  },

  handleAddIngredient(recipeId) {
    const input = document.getElementById('add-ingredient-input');
    if (!input || !input.value.trim()) return;
    RecipeManager.addIngredientToRecipe(recipeId, input.value);
    this.render();
    const refreshedInput = document.getElementById('add-ingredient-input');
    if (refreshedInput) refreshedInput.focus();
  },

  handleRemoveIngredient(recipeId, ingredientId) {
    RecipeManager.removeIngredientFromRecipe(recipeId, ingredientId);
    this.render();
  },

  handleAddStep(recipeId) {
    const input = document.getElementById('add-step-input');
    if (!input || !input.value.trim()) return;
    RecipeManager.addStepToRecipe(recipeId, input.value);
    this.render();
    const refreshedInput = document.getElementById('add-step-input');
    if (refreshedInput) refreshedInput.focus();
  },

  handleRemoveStep(recipeId, stepId) {
    RecipeManager.removeStep(recipeId, stepId);
    this.render();
  },

  moveStep(recipeId, fromIndex, toIndex) {
    RecipeManager.reorderStep(recipeId, fromIndex, toIndex);
    this.render();
  },

  onStepDragStart(event, index) {
    this.draggedStepIndex = index;
    event.currentTarget.classList.add('step-dragging');
  },

  onStepDragOver(event) {
    event.preventDefault();
  },

  onStepDrop(event, recipeId, targetIndex) {
    event.preventDefault();
    if (this.draggedStepIndex !== null && this.draggedStepIndex !== targetIndex) {
      RecipeManager.reorderStep(recipeId, this.draggedStepIndex, targetIndex);
      this.draggedStepIndex = null;
      this.render();
    }
  },

  handlePhotoUpload(event, recipeId) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      RecipeManager.updateRecipeField(recipeId, 'photo_path', e.target.result);
      this.render();
    };
    reader.readAsDataURL(file);
  },

  handleSamplePhoto(recipeId) {
    const r = RecipeManager.getHydratedRecipe(recipeId);
    const title = encodeURIComponent(r?.recipe_title || 'Finished Dish');
    const sampleUrl = `https://placehold.co/800x450/C2410C/FFFFFF?text=${title}`;
    RecipeManager.updateRecipeField(recipeId, 'photo_path', sampleUrl);
    this.render();
  },

  handleRemovePhoto(recipeId) {
    RecipeManager.updateRecipeField(recipeId, 'photo_path', '');
    this.render();
  },

  handleDuplicateRecipe(recipeId) {
    const copy = RecipeManager.duplicateRecipe(recipeId);
    if (copy) {
      this.openRecipeEditor(copy.recipe_id, false);
    }
  },

  /* =====================================================================
   * VIEW 4: FULL-WIDTH DESKTOP RECIPE READING VIEW
   * ===================================================================== */
  buildRecipeDetailCardHTML(recipeId) {
    const recipe = RecipeManager.getHydratedRecipe(recipeId);
    if (!recipe) {
      return `<p class="text-body">Recipe not found.</p>`;
    }

    return `
      <div class="space-y-6 sm:space-y-8">
        
        <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-stone-300/80">
          <button onclick="UI.switchTab('recipes')" class="btn-secondary !px-3.5 sm:!px-4 !py-2">
            <span>←</span>
            <span>Recipes</span>
          </button>

          <span class="text-small hidden md:flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-tagGreen inline-block"></span>
            <span>Screen stays awake while cooking</span>
          </span>

          <div class="flex items-center gap-2 sm:gap-2.5 ml-auto md:ml-0">
            <button onclick="UI.openRecipeEditor(${recipe.recipe_id}, false)" class="btn-main !min-h-[42px] !px-4 sm:!px-5 !py-2">
              Edit Recipe
            </button>
            <div class="relative">
              <button onclick="UI.toggleDetailMenu()" class="btn-icon" title="More options">
                <span class="font-bold text-xl leading-none">⋮</span>
              </button>
              <div id="detail-kebab-menu" class="hidden absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-30">
                <button onclick="UI.openRecipeEditor(${recipe.recipe_id}, false)" class="w-full text-left px-4 py-2.5 text-body hover:bg-gray-50">
                  Edit
                </button>
                <button onclick="UI.handleDuplicateRecipe(${recipe.recipe_id})" class="w-full text-left px-4 py-2.5 text-body hover:bg-gray-50">
                  Duplicate
                </button>
                <hr class="my-1 border-gray-100">
                <button onclick="UI.openDeleteRecipeModal(${recipe.recipe_id})" class="w-full text-left px-4 py-2.5 text-body hover:bg-red-50 text-danger font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pb-6 sm:pb-8 border-b border-stone-300/80">
          <div class="${recipe.photo_path ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4">
            <h1 class="text-heading !text-2xl sm:!text-4xl">${this.esc(recipe.recipe_title || 'Untitled Recipe')}</h1>
            ${recipe.description ? `
              <p class="text-body text-stone-700 max-w-3xl">${this.esc(recipe.description)}</p>
            ` : ''}

            ${recipe.tags.length > 0 ? `
              <div class="flex flex-wrap gap-2 pt-1">
                ${recipe.tags.map(t => `
                  <span class="chip selected !min-h-[34px] !py-1 !px-3.5 !text-sm pointer-events-none">
                    ✓ ${this.esc(t.tag_name)}
                  </span>
                `).join('')}
              </div>
            ` : ''}

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-stone-300/70">
              <div>
                <span class="text-small block">Prep time</span>
                <strong class="text-body font-semibold">${recipe.prep_time_min || 0} min</strong>
              </div>
              <div>
                <span class="text-small block">Cook time</span>
                <strong class="text-body font-semibold">${recipe.cook_time_min || 0} min</strong>
              </div>
              <div>
                <span class="text-small block">Total time</span>
                <strong class="text-body font-semibold text-primary">${recipe.total_time_min} min</strong>
              </div>
              <div>
                <span class="text-small block">Servings</span>
                <strong class="text-body font-semibold">${recipe.servings || '-'}</strong>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <span class="text-small block">Difficulty</span>
                <strong class="text-body font-semibold">${recipe.difficulty ? `${recipe.difficulty} / 5` : '-'}</strong>
              </div>
            </div>
          </div>

          ${recipe.photo_path ? `
            <div class="lg:col-span-5 rounded-2xl overflow-hidden border border-stone-300">
              <img src="${this.esc(recipe.photo_path)}" alt="${this.esc(recipe.recipe_title)}" 
                   class="w-full h-56 sm:h-72 object-cover"
                   onerror="this.parentElement.style.display='none'">
            </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div class="lg:col-span-4 space-y-6 sm:space-y-8">
            <div class="space-y-3">
              <h2 class="text-heading">Ingredients</h2>
              ${recipe.ingredients.length === 0 ? `
                <p class="text-small">No ingredients listed yet.</p>
              ` : `
                <ul class="divide-y divide-stone-300/70 border-t border-b border-stone-300/70">
                  ${recipe.ingredients.map(ing => `
                    <li class="py-3 text-body flex items-center gap-3">
                      <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                      <span>${this.esc(ing.formatted)}</span>
                    </li>
                  `).join('')}
                </ul>
              `}
            </div>

            ${recipe.personal_notes ? `
              <div class="pt-4 border-t-2 border-primary/40">
                <h3 class="text-heading !text-[18px] mb-1.5 text-primary">Personal Notes</h3>
                <p class="text-body text-stone-800">${this.esc(recipe.personal_notes)}</p>
              </div>
            ` : ''}
          </div>

          <div class="lg:col-span-8 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-300/70 lg:pl-12 space-y-4">
            <h2 class="text-heading">How to Make It</h2>
            ${recipe.steps.length === 0 ? `
              <p class="text-small">No instructions added yet.</p>
            ` : `
              <ol class="divide-y divide-stone-300/70 border-t border-b border-stone-300/70">
                ${recipe.steps.map(step => `
                  <li class="flex items-start gap-4 py-5">
                    <span class="w-8 h-8 rounded-full bg-primary text-white font-semibold text-base flex items-center justify-center shrink-0 mt-0.5">
                      ${step.step_number}
                    </span>
                    <p class="text-body flex-1 pt-0.5">${this.esc(step.instruction)}</p>
                  </li>
                `).join('')}
              </ol>
            `}
          </div>

        </div>
      </div>
    `;
  },

  toggleDetailMenu() {
    const menu = document.getElementById('detail-kebab-menu');
    if (menu) menu.classList.toggle('hidden');
  },

  /* =====================================================================
   * DELETE CONFIRMATION MODAL HANDLERS
   * ===================================================================== */
  openDeleteRecipeModal(recipeId) {
    const r = RecipeManager.getHydratedRecipe(recipeId);
    if (!r) return;

    const modal = document.getElementById('delete-modal');
    const titleEl = document.getElementById('delete-modal-title');
    const descEl = document.getElementById('delete-modal-desc');
    const confirmBtn = document.getElementById('btn-confirm-delete');

    titleEl.textContent = "Are you sure you want to delete this recipe?";
    descEl.textContent = `"${r.recipe_title || 'Untitled recipe'}" will be permanently removed from your notebook.`;

    confirmBtn.onclick = () => {
      RecipeManager.deleteRecipe(recipeId);
      this.closeDeleteModal();
      this.switchTab('recipes');
    };

    modal.classList.remove('hidden');
  },

  openDeleteIdeaModal(ideaId) {
    const idea = IdeasManager.getIdeaById(ideaId);
    if (!idea) return;

    const modal = document.getElementById('delete-modal');
    const titleEl = document.getElementById('delete-modal-title');
    const descEl = document.getElementById('delete-modal-desc');
    const confirmBtn = document.getElementById('btn-confirm-delete');

    titleEl.textContent = "Are you sure you want to delete this idea?";
    descEl.textContent = `"${idea.idea_title}" will be removed from your Ideas list.`;

    confirmBtn.onclick = () => {
      IdeasManager.deleteIdea(ideaId);
      this.closeDeleteModal();
      this.render();
    };

    modal.classList.remove('hidden');
  },

  confirmResetDemoData() {
    const modal = document.getElementById('delete-modal');
    const titleEl = document.getElementById('delete-modal-title');
    const descEl = document.getElementById('delete-modal-desc');
    const confirmBtn = document.getElementById('btn-confirm-delete');

    titleEl.textContent = "Reset notebook to initial demo data?";
    descEl.textContent = "This will restore the sample recipes and ideas for the active demo user.";

    confirmBtn.onclick = () => {
      StorageService.resetToSeed();
      this.closeDeleteModal();
      this.render();
    };

    modal.classList.remove('hidden');
  },

  closeDeleteModal() {
    document.getElementById('delete-modal')?.classList.add('hidden');
  }
};

window.onload = function () {
  UI.init();
};