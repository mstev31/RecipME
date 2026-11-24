/**
 * RecipME Cloudflare Worker API + Hourly 24h Guest Cleanup
 * Backed by Cloudflare D1 (SQLite) with HttpOnly cookie sessions
 */

const COOKIE_NAME = 'recipme_guest_id';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24; // 24 hours

const BASE_TAGS = [
  { tag_id: 1, tag_name: 'Chicken', is_preset: 1 },
  { tag_id: 2, tag_name: 'Weeknight', is_preset: 1 },
  { tag_id: 3, tag_name: 'Fish', is_preset: 1 },
  { tag_id: 4, tag_name: 'Gluten-Free', is_preset: 1 },
  { tag_id: 5, tag_name: 'Holiday', is_preset: 1 },
  { tag_id: 6, tag_name: 'Vegetarian', is_preset: 1 }
];

const BADGE_PALETTE = ['#C2410C', '#3F7D3A', '#1D4ED8', '#7C3AED', '#B45309', '#0F766E'];

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

function buildSessionCookie(guestId, requestUrl, clear = false) {
  const isHttps = new URL(requestUrl).protocol === 'https:';
  const attrs = [
    `${COOKIE_NAME}=${clear ? '' : encodeURIComponent(guestId)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    clear ? 'Max-Age=0' : `Max-Age=${SESSION_MAX_AGE_SEC}`
  ];
  if (isHttps) attrs.push('Secure');
  return attrs.join('; ');
}

function pickBadgeColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return BADGE_PALETTE[Math.abs(hash) % BADGE_PALETTE.length];
}

async function getGuestById(db, guestId) {
  if (!guestId) return null;
  const row = await db
    .prepare(
      `SELECT guest_id, guest_name, is_prepopulated, badge_color, created_at, expires_at
       FROM guests
       WHERE guest_id = ?
         AND (is_prepopulated = 1 OR expires_at IS NULL OR expires_at > datetime('now'))`
    )
    .bind(guestId)
    .first();
  return row || null;
}

async function loadGuestState(db, guestId) {
  const [ideasRes, recipesRes, stepsRes, ingredientsRes, recipeIngsRes, tagsRes, recipeTagsRes] =
    await db.batch([
      db.prepare('SELECT idea_id, idea_title, idea_note, created_at, updated_at FROM idea WHERE guest_id = ? ORDER BY updated_at DESC').bind(guestId),
      db.prepare('SELECT recipe_id, source_idea_id, recipe_title, description, prep_time_min, cook_time_min, servings, difficulty, personal_notes, photo_path, created_at, updated_at FROM recipe WHERE guest_id = ? ORDER BY updated_at DESC').bind(guestId),
      db.prepare('SELECT step_id, recipe_id, step_number, instruction FROM step WHERE guest_id = ? ORDER BY recipe_id, step_number ASC').bind(guestId),
      db.prepare('SELECT ingredient_id, ingredient_name FROM ingredient WHERE guest_id = ? ORDER BY ingredient_id ASC').bind(guestId),
      db.prepare('SELECT recipe_id, ingredient_id, quantity, unit, line_order FROM recipe_ingredient WHERE guest_id = ? ORDER BY recipe_id, line_order ASC').bind(guestId),
      db.prepare('SELECT tag_id, tag_name, is_preset FROM tag WHERE guest_id = ? ORDER BY tag_id ASC').bind(guestId),
      db.prepare('SELECT recipe_id, tag_id FROM recipe_tag WHERE guest_id = ?').bind(guestId)
    ]);

  return {
    idea: ideasRes.results || [],
    recipe: recipesRes.results || [],
    step: stepsRes.results || [],
    ingredient: ingredientsRes.results || [],
    recipe_ingredient: recipeIngsRes.results || [],
    tag: (tagsRes.results || []).map(t => ({ ...t, is_preset: Boolean(t.is_preset) })),
    recipe_tag: recipeTagsRes.results || []
  };
}

async function saveGuestState(db, guestId, payload) {
  const now = new Date().toISOString();
  const ideas = Array.isArray(payload.idea) ? payload.idea : [];
  const recipes = Array.isArray(payload.recipe) ? payload.recipe : [];
  const steps = Array.isArray(payload.step) ? payload.step : [];
  const ingredients = Array.isArray(payload.ingredient) ? payload.ingredient : [];
  const recipeIngs = Array.isArray(payload.recipe_ingredient) ? payload.recipe_ingredient : [];
  const tags = Array.isArray(payload.tag) ? payload.tag : [];
  const recipeTags = Array.isArray(payload.recipe_tag) ? payload.recipe_tag : [];

  const stmts = [
    // Clear child tables first to satisfy foreign keys cleanly
    db.prepare('DELETE FROM recipe_tag WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM recipe_ingredient WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM step WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM recipe WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM idea WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM ingredient WHERE guest_id = ?').bind(guestId),
    db.prepare('DELETE FROM tag WHERE guest_id = ?').bind(guestId)
  ];

  for (const t of tags) {
    stmts.push(
      db.prepare('INSERT INTO tag (guest_id, tag_id, tag_name, is_preset) VALUES (?, ?, ?, ?)')
        .bind(guestId, Number(t.tag_id), String(t.tag_name || '').slice(0, 60), t.is_preset ? 1 : 0)
    );
  }

  for (const i of ideas) {
    stmts.push(
      db.prepare('INSERT INTO idea (guest_id, idea_id, idea_title, idea_note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          guestId,
          Number(i.idea_id),
          String(i.idea_title || '').slice(0, 200),
          String(i.idea_note || '').slice(0, 4000),
          i.created_at || now,
          i.updated_at || now
        )
    );
  }

  const validRecipeIds = new Set();
  for (const r of recipes) {
    const rId = Number(r.recipe_id);
    validRecipeIds.add(rId);
    stmts.push(
      db.prepare(
        `INSERT INTO recipe
          (guest_id, recipe_id, source_idea_id, recipe_title, description, prep_time_min, cook_time_min, servings, difficulty, personal_notes, photo_path, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        guestId,
        rId,
        r.source_idea_id != null ? Number(r.source_idea_id) : null,
        String(r.recipe_title || '').slice(0, 200),
        String(r.description || '').slice(0, 4000),
        r.prep_time_min != null && r.prep_time_min !== '' ? Number(r.prep_time_min) : null,
        r.cook_time_min != null && r.cook_time_min !== '' ? Number(r.cook_time_min) : null,
        r.servings != null && r.servings !== '' ? Number(r.servings) : null,
        r.difficulty != null && r.difficulty !== '' ? Number(r.difficulty) : null,
        String(r.personal_notes || '').slice(0, 4000),
        String(r.photo_path || '').slice(0, 350000),
        r.created_at || now,
        r.updated_at || now
      )
    );
  }

  const validIngredientIds = new Set();
  for (const ing of ingredients) {
    const ingId = Number(ing.ingredient_id);
    validIngredientIds.add(ingId);
    stmts.push(
      db.prepare('INSERT INTO ingredient (guest_id, ingredient_id, ingredient_name) VALUES (?, ?, ?)')
        .bind(guestId, ingId, String(ing.ingredient_name || '').slice(0, 160))
    );
  }

  for (const s of steps) {
    const rId = Number(s.recipe_id);
    if (!validRecipeIds.has(rId)) continue;
    stmts.push(
      db.prepare('INSERT INTO step (guest_id, step_id, recipe_id, step_number, instruction) VALUES (?, ?, ?, ?, ?)')
        .bind(guestId, Number(s.step_id), rId, Number(s.step_number), String(s.instruction || '').slice(0, 2000))
    );
  }

  for (const ri of recipeIngs) {
    const rId = Number(ri.recipe_id);
    const ingId = Number(ri.ingredient_id);
    if (!validRecipeIds.has(rId) || !validIngredientIds.has(ingId)) continue;
    stmts.push(
      db.prepare('INSERT OR REPLACE INTO recipe_ingredient (guest_id, recipe_id, ingredient_id, quantity, unit, line_order) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          guestId,
          rId,
          ingId,
          ri.quantity != null && ri.quantity !== '' ? Number(ri.quantity) : null,
          String(ri.unit || '').slice(0, 40),
          Number(ri.line_order) || 1
        )
    );
  }

  const validTagIds = new Set(tags.map(t => Number(t.tag_id)));
  for (const rt of recipeTags) {
    const rId = Number(rt.recipe_id);
    const tId = Number(rt.tag_id);
    if (!validRecipeIds.has(rId) || !validTagIds.has(tId)) continue;
    stmts.push(
      db.prepare('INSERT OR IGNORE INTO recipe_tag (guest_id, recipe_id, tag_id) VALUES (?, ?, ?)')
        .bind(guestId, rId, tId)
    );
  }

  await db.batch(stmts);
}

async function cleanupExpiredGuests(db) {
  await db
    .prepare("DELETE FROM guests WHERE is_prepopulated = 0 AND expires_at IS NOT NULL AND expires_at <= datetime('now')")
    .run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      // 1. POST /api/guest-login — Create a new 24h isolated guest session
      if (path === '/api/guest-login' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const rawName = String(body.name || '').trim();
        if (!rawName || rawName.length > 60) {
          return jsonResponse({ error: 'Please enter your name (1 to 60 characters).' }, 400);
        }

        const guestId = crypto.randomUUID();
        const badgeColor = pickBadgeColor(rawName);
        const nowIso = new Date().toISOString();

        const stmts = [
          env.DB.prepare(
            `INSERT INTO guests (guest_id, guest_name, is_prepopulated, badge_color, created_at, expires_at)
             VALUES (?, ?, 0, ?, ?, datetime('now', '+24 hours'))`
          ).bind(guestId, rawName, badgeColor, nowIso)
        ];

        // Seed preset tags so the judge can filter and tag recipes right away
        for (const t of BASE_TAGS) {
          stmts.push(
            env.DB.prepare('INSERT INTO tag (guest_id, tag_id, tag_name, is_preset) VALUES (?, ?, ?, ?)')
              .bind(guestId, t.tag_id, t.tag_name, t.is_preset)
          );
        }

        await env.DB.batch(stmts);

        const guest = await getGuestById(env.DB, guestId);
        const state = await loadGuestState(env.DB, guestId);

        return jsonResponse(
          { user: guest, db: state },
          200,
          { 'Set-Cookie': buildSessionCookie(guestId, request.url) }
        );
      }

      // 2. POST /api/demo-login — Sign into one of the prepopulated presenter accounts
      if (path === '/api/demo-login' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const accountId = body.accountId === 'demo_presenter_2' ? 'demo_presenter_2' : 'demo_presenter_1';
        const guest = await getGuestById(env.DB, accountId);

        if (!guest) {
          return jsonResponse({ error: 'Prepopulated demo account not found. Did you run schema.sql?' }, 404);
        }

        const state = await loadGuestState(env.DB, accountId);
        return jsonResponse(
          { user: guest, db: state },
          200,
          { 'Set-Cookie': buildSessionCookie(accountId, request.url) }
        );
      }

      // 3. POST /api/logout — Clear session cookie
      if (path === '/api/logout' && request.method === 'POST') {
        return jsonResponse(
          { ok: true },
          200,
          { 'Set-Cookie': buildSessionCookie('', request.url, true) }
        );
      }

      // 4. GET /api/state — Load active guest's profile and isolated D1 data
      if (path === '/api/state' && request.method === 'GET') {
        const guestId = getCookie(request, COOKIE_NAME);
        const guest = await getGuestById(env.DB, guestId);
        if (!guest) {
          return jsonResponse({ authenticated: false }, 401);
        }
        const state = await loadGuestState(env.DB, guest.guest_id);
        return jsonResponse({ authenticated: true, user: guest, db: state });
      }

      // 5. POST /api/state — Persist active guest's data back to D1
      if (path === '/api/state' && request.method === 'POST') {
        const guestId = getCookie(request, COOKIE_NAME);
        const guest = await getGuestById(env.DB, guestId);
        if (!guest) {
          return jsonResponse({ error: 'Session expired. Please enter your name again.' }, 401);
        }
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') {
          return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
        }
        await saveGuestState(env.DB, guest.guest_id, body);
        return jsonResponse({ ok: true, saved_at: new Date().toISOString() });
      }

      // 6. GET /api/admin/overview — Live Demo Day dashboard data across all guests
      if (path === '/api/admin/overview' && request.method === 'GET') {
        const providedKey = request.headers.get('X-Admin-Key') || url.searchParams.get('key') || '';
        const expectedKey = env.ADMIN_KEY || 'LSU4125';
        if (providedKey !== expectedKey) {
          return jsonResponse({ error: 'Invalid admin passcode.' }, 403);
        }

        const [guestsRes, recipesRes, ideasRes, stepsRes, ingRes, tagRes] = await env.DB.batch([
          env.DB.prepare(
            `SELECT guest_id, guest_name, is_prepopulated, badge_color, created_at, expires_at
             FROM guests
             WHERE is_prepopulated = 1 OR expires_at IS NULL OR expires_at > datetime('now')
             ORDER BY is_prepopulated ASC, created_at DESC`
          ),
          env.DB.prepare(
            `SELECT guest_id, recipe_id, recipe_title, description, prep_time_min, cook_time_min, servings, difficulty, updated_at
             FROM recipe
             ORDER BY updated_at DESC`
          ),
          env.DB.prepare(
            `SELECT guest_id, idea_id, idea_title, idea_note, updated_at
             FROM idea
             ORDER BY updated_at DESC`
          ),
          env.DB.prepare('SELECT guest_id, recipe_id, COUNT(*) AS step_count FROM step GROUP BY guest_id, recipe_id'),
          env.DB.prepare('SELECT guest_id, recipe_id, COUNT(*) AS ingredient_count FROM recipe_ingredient GROUP BY guest_id, recipe_id'),
          env.DB.prepare(
            `SELECT rt.guest_id, rt.recipe_id, t.tag_name
             FROM recipe_tag rt
             JOIN tag t ON t.guest_id = rt.guest_id AND t.tag_id = rt.tag_id`
          )
        ]);

        const stepCounts = new Map();
        for (const row of stepsRes.results || []) {
          stepCounts.set(`${row.guest_id}:${row.recipe_id}`, row.step_count);
        }

        const ingCounts = new Map();
        for (const row of ingRes.results || []) {
          ingCounts.set(`${row.guest_id}:${row.recipe_id}`, row.ingredient_count);
        }

        const tagMap = new Map();
        for (const row of tagRes.results || []) {
          const k = `${row.guest_id}:${row.recipe_id}`;
          if (!tagMap.has(k)) tagMap.set(k, []);
          tagMap.get(k).push(row.tag_name);
        }

        const recipesByGuest = new Map();
        for (const r of recipesRes.results || []) {
          const k = `${r.guest_id}:${r.recipe_id}`;
          const enriched = {
            ...r,
            step_count: stepCounts.get(k) || 0,
            ingredient_count: ingCounts.get(k) || 0,
            tags: tagMap.get(k) || []
          };
          if (!recipesByGuest.has(r.guest_id)) recipesByGuest.set(r.guest_id, []);
          recipesByGuest.get(r.guest_id).push(enriched);
        }

        const ideasByGuest = new Map();
        for (const idea of ideasRes.results || []) {
          if (!ideasByGuest.has(idea.guest_id)) ideasByGuest.set(idea.guest_id, []);
          ideasByGuest.get(idea.guest_id).push(idea);
        }

        const guests = (guestsRes.results || []).map(g => ({
          ...g,
          is_prepopulated: Boolean(g.is_prepopulated),
          recipes: recipesByGuest.get(g.guest_id) || [],
          ideas: ideasByGuest.get(g.guest_id) || []
        }));

        const liveGuests = guests.filter(g => !g.is_prepopulated);
        const demoAccounts = guests.filter(g => g.is_prepopulated);

        return jsonResponse({
          generated_at: new Date().toISOString(),
          summary: {
            live_guests: liveGuests.length,
            live_recipes: liveGuests.reduce((sum, g) => sum + g.recipes.length, 0),
            live_ideas: liveGuests.reduce((sum, g) => sum + g.ideas.length, 0),
            demo_accounts: demoAccounts.length
          },
          live_guests: liveGuests,
          demo_accounts: demoAccounts
        });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (err) {
      console.error('Worker API error:', err);
      return jsonResponse({ error: 'Server error while communicating with database.' }, 500);
    }
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(cleanupExpiredGuests(env.DB));
  }
};
