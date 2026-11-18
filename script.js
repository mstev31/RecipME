/*************************************************************************
 * PREDETERMINED DEMO ACCOUNT (For Live Presentation)
 *************************************************************************/
const DEMO_ACCOUNTS = {
  demoDay: {
    id: 'demo_day_user',
    name: 'Demo Day',
    email: 'demoday@recipme.app',
    password: 'RecipME2026!',
    initials: 'DD',
    badgeColor: '#C2410C'
  }
};

/*************************************************************************
 * LAYER 1: STORAGE SERVICE & LOCAL RELATIONAL DATABASE (3NF Schema)
 *************************************************************************/
const StorageService = {
  SESSION_KEY: 'recipme_active_demo_user_v2',
  currentUser: null,
  db: null,

  getStorageKey() {
    const uid = this.currentUser ? this.currentUser.id : DEMO_ACCOUNTS.demoDay.id;
    return `recipme_sqlite_db_${uid}_v1`;
  },

  getSeedDatabase() {
    const now = new Date().toISOString();
    const baseTags = [
      { tag_id: 1, tag_name: "Chicken", is_preset: true },
      { tag_id: 2, tag_name: "Weeknight", is_preset: true },
      { tag_id: 3, tag_name: "Fish", is_preset: true },
      { tag_id: 4, tag_name: "Gluten-Free", is_preset: true },
      { tag_id: 5, tag_name: "Holiday", is_preset: true },
      { tag_id: 6, tag_name: "Vegetarian", is_preset: true }
    ];

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
      if (savedSession) {
        this.currentUser = JSON.parse(savedSession);
        this.loadActiveUserDatabase();
      } else {
        this.currentUser = null;
        this.db = this.getSeedDatabase();
      }
    } catch (err) {
      console.error("Database initialization fallback:", err);
      this.currentUser = null;
      this.db = this.getSeedDatabase();
    }
  },

  loadActiveUserDatabase() {
    try {
      const saved = localStorage.getItem(this.getStorageKey());
      if (saved) {
        this.db = JSON.parse(saved);
      } else {
        this.db = this.getSeedDatabase();
        this.commit();
      }
    } catch (err) {
      this.db = this.getSeedDatabase();
    }
  },

  setActiveUser(userObj) {
    this.currentUser = userObj;
    if (userObj) {
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(userObj));
      } catch (e) {
        // Ignore storage errors on session key
      }
      this.loadActiveUserDatabase();
    } else {
      localStorage.removeItem(this.SESSION_KEY);
    }
  },

  clearSession() {
    this.currentUser = null;
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {
      // Ignore storage errors
    }
  },

  commit() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.db));
      document.getElementById('storage-error-banner')?.classList.add('hidden');
      UI.notifyAutosave();
      UI.updateNavBadges();
    } catch (err) {
      document.getElementById('storage-error-banner')?.classList.remove('hidden');
    }
  },

  nextId(tableName, pkField) {
    const rows = this.db[tableName] || [];
    if (rows.length === 0) return 1;
    return Math.max(...rows.map(r => Number(r[pkField]) || 0)) + 1;
  }
};

/*************************************************************************
 * LAYER 2: APPLICATION LOGIC LAYER
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
        const titleMatch = (recipe.recipe_title || "").toLowerCase().includes