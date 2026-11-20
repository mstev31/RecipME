# RecipME — Personal Recipe Notebook & Idea Keeper

**Live Demo:** [https://recipme.mhsrockss.workers.dev/](https://recipme.mhsrockss.workers.dev/)

RecipME is a calm, ad-free personal recipe notebook and cooking idea keeper built for home cooks who want to capture meal sparks, preserve family recipes, and cook without clutter.

Built for **ISDS 4125: Analysis and Design of Information Systems (Fall 2026)** at Louisiana State University (E.J. Ourso College of Business).

---

## Try the Live App (Demo Day Access)

1. Open **[https://recipme.mhsrockss.workers.dev/](https://recipme.mhsrockss.workers.dev/)** on any phone, tablet, or desktop browser.
2. Click the **Demo Day Login** button to automatically prefill the presentation credentials (`demoday@recipme.app` / `RecipME2026!`).
3. Click **Sign In** to explore your own isolated local sandbox.

---

## Key Features

- **Idea-to-Recipe Workflow:** Jot down quick meal sparks in the **Ideas** tab and click **Turn into Recipe** to automatically carry the title and notes into a structured recipe draft.
- **Effortless Recipe Studio:**
  - **Smart Ingredient Parsing:** Type naturally (e.g., `2 lb chicken thighs`) and RecipME automatically separates quantity, unit, and ingredient name.
  - **Reorderable Cooking Steps:** Add numbered steps and rearrange them via drag-and-drop or Up/Down controls.
  - **Auto-Calculated Total Time:** Prep time and cook time dynamically calculate total time.
  - **Personalization:** Add a 1–5 difficulty rating, preset or custom tags, personal cooking tips, and a finished-dish photo.
- **Instant Search & Filtering:** Search across recipe titles, ingredients, and notes in real time, or filter by tag chips (e.g., *Chicken*, *Weeknight*, *Gluten-Free*, *Holiday*).
- **Kitchen Accessibility (Settings):**
  - **Warm Dark Mode:** Low-glare charcoal theme designed for dimly lit kitchens.
  - **Larger Text Mode:** Scales typography across the entire app for counter-distance reading.
- **Fault Avoidance & Safety:** Real-time auto-save on every keystroke, delete confirmation dialogs, automatic cleanup of empty drafts, and plain-language storage-full warnings.

---

## Architecture & Tech Stack

- **Frontend:** Responsive HTML5, Tailwind CSS, custom serif typography (`style.css`), and modular Vanilla JavaScript (`script.js`)—no build step required.
- **Data Layer (3NF Local-First Schema):** Modeled in **Third Normal Form (3NF)** across 7 normalized tables (`idea`, `recipe`, `step`, `ingredient`, `recipe_ingredient`, `tag`, and `recipe_tag`) and persisted locally in the browser via `localStorage`. Total time is computed dynamically to maintain 3NF.
- **Hosting & Deployment:** Continuously deployed from GitHub to **Cloudflare Workers** for global edge delivery and automatic HTTPS.

---

## Project Structure

```text
├── index.html          # Application shell, login screen, and modals (Settings, Account, Delete)
├── style.css           # Design system, Warm Dark Mode, Larger Text Mode, and component styles
├── script.js           # StorageService (3NF localStorage), IdeasManager, RecipeManager, Search & UI
├── RecipME Logo.jpg    # Custom RecipME branding & favicon
└── README.md           # Project overview and setup instructions
