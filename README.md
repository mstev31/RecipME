# RecipME — Personal Recipe Notebook & Idea Keeper

**Live Demo:** [https://recipme.lsurecipme.workers.dev/](https://recipme.lsurecipme.workers.dev/)  
**Live Presenter Dashboard:** `https://recipme.lsurecipme.workers.dev/admin.html`

RecipME is a calm, ad-free personal recipe notebook and cooking idea keeper built for home cooks who want to capture meal sparks, preserve family recipes, and cook without clutter.

Built for **ISDS 4125: Analysis and Design of Information Systems (Fall 2026)** at Louisiana State University (E.J. Ourso College of Business).

---

## Try the Live App (Demo Day Access)

1. Open **[https://recipme.lsurecipme.workers.dev/](https://recipme.lsurecipme.workers.dev/)** on any phone, tablet, or desktop browser.
2. Enter your name and click **Start Cooking** to create your own isolated 24-hour notebook backed by Cloudflare D1.
3. Or select **Demo Day Host** / **Family Kitchen** to explore a prepopulated recipe collection.

---

## Architecture & Tech Stack

- **Frontend (`public/`):** Responsive HTML5, Tailwind CSS, custom serif typography (`style.css`), and modular Vanilla JavaScript (`script.js`).
- **Backend API (`worker.js`):** Cloudflare Worker handling guest session creation (`HttpOnly` cookie), isolated CRUD sync (`/api/state`), prepopulated demo login (`/api/demo-login`), live presenter overview (`/api/admin/overview`), and hourly Cron Trigger cleanup of expired 24-hour guest sessions.
- **Database (`schema.sql`):** Live **Cloudflare D1 (SQLite)** relational database normalized to **Third Normal Form (3NF)** across `guests`, `idea`, `recipe`, `step`, `ingredient`, `recipe_ingredient`, `tag`, and `recipe_tag` with `ON DELETE CASCADE`.

---

## Project Structure

```text
├── wrangler.jsonc          # Cloudflare Workers, Static Assets, D1 binding, and Cron Trigger config
├── schema.sql              # 3NF D1 schema + prepopulated Demo Day presenter accounts
├── worker.js               # Cloudflare Worker API + hourly 24-hour guest cleanup
├── public/
│   ├── index.html          # Guest entry screen, app shell, and modals
│   ├── script.js           # Cloudflare D1 StorageService, IdeasManager, RecipeManager, Search & UI
│   ├── style.css           # Design system, Warm Dark Mode, Larger Text Mode
│   ├── admin.html          # Live Demo Day presenter dashboard (polls D1 every 4s)
│   └── RecipME Logo.jpg    # Custom RecipME branding & favicon
└── README.md
```

---

## Team

- **Mackenzie Stevens**
- **Abby Myers**
- **Haley Johnson**
- **Molly Buras**
