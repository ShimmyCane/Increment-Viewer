---
name: increment-scenes
description: Save a project's increments (scenes) to the project database and export them as an Increment Viewer data file (data/<name>.js plus a line in data/sets.js). Use when the user asks to save, export, publish or add scenes, views or increments to the Increment Viewer, or to create a review for a new project.
---

# Increment scenes: save and export for the Increment Viewer

The viewer shows a list of scenes (called "items" in the data). Each scene is one increment: a picture, what changed, and what still needs work. This skill saves those scenes to the project's database and writes the viewer's data file, so the viewer can show them.

Read `schematic.md` in the viewer repo first. It is the source of truth for the data format.

## 1. Gather the scenes

For each scene, collect:

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Short label, such as `V1` or `V02` |
| `title` | no | Short name |
| `image` | no | Path relative to `viewer.html` (for example `../<Project>/renders/v1.png`). Leave out for a state card |
| `description` | yes | What this version is |
| `changes` | yes | Array of strings: what changed |
| `gaps` | no | Array of strings: still to fix |
| `card` | no | `{ kicker, bars: [{label, value, max, color}], note }` for a step with no picture |

Keep the order of the scenes. The first scene is the first step.

## 2. Pick the database

Two Supabase projects are connected here. Use the one the user chose. If the user has not chosen, ask once:

- **Architecture** (`xabgankckrcuhcgdolrg`, us-east-2): practice and Make 3D data (`m3d_scenes` holds saved 3-D scene bundles).
- **Family** (`twvqvutrcobedvuhnzxq`, us-west-2): the family apps. Its `app_table_registry` lists which app owns which table.

Before writing, check the target. Never write to a table another app owns. Add the new table to the database's `app_table_registry` (Family) or `table_index` (Architecture) with the project name, so other apps can see who owns it.

## 3. Save to the database

Use one set of rows per review. Table and columns (this proposal is not created yet; create it only after the user agrees):

```sql
create table if not exists viewer_scenes (
  set_id    text    not null,           -- the data file name, e.g. living_room
  position  integer not null,           -- 1-based order
  item      jsonb   not null,           -- one scene exactly as in the data file
  updated_at timestamptz not null default now(),
  primary key (set_id, position)
);

create table if not exists viewer_hidden_scenes (
  scene_id  text primary key,           -- e.g. living_room or world:growth_paper
  hidden_at timestamptz not null default now()
);

alter table viewer_scenes enable row level security;
alter table viewer_hidden_scenes enable row level security;
```

RLS is on, so the viewer's public key cannot read or write these tables by itself. Add a policy or an edge function that matches how the user wants access controlled. Do not open them to everyone without asking.

Write the scenes as one batch: delete the old rows for `set_id`, then insert the new ones. Show the user the row count before and after.

## 4. Export the viewer data file

Write `data/<set_id>.js` in the viewer repo:

```js
// Review data for <project>. Images are read relative to viewer.html.
window.REVIEW_DATA = {
  title: "<Project>: V1 to V10",
  subtitle: "One line about the review",
  items: [
    { id: "V1", title: "First trace", image: "../<Project>/renders/v1.png",
      description: "...", changes: ["..."], gaps: ["..."] }
  ]
};
```

Then add one line to `window.REVIEW_SETS` in `data/sets.js`: `{ id: "<set_id>", label: "<Project>: V1 to V10" }`. Do not start a new file for a later time span of the same project. Add to the existing file (see `schematic.md`).

Check the export:

```bash
node --check data/<set_id>.js && node --check data/sets.js
```

Confirm every `image` path exists: `ls` it from the repo root, resolving `../` from `viewer.html`.

## 5. Keep the database and the file in step

The file is what the viewer reads. The database is the saved copy. After any change, re-export from the database (or write both from the same source) so they agree. Report any scene that exists in one but not the other.

## 6. Hidden scenes (Delete scene button)

The viewer's Delete scene button hides a scene. It never deletes the data file. The hidden list is read from and written to the back end set in `data/sets.js`:

```js
window.VIEWER_BACKEND = { hiddenUrl: "<endpoint>" };   // "" = this browser only
```

The endpoint must accept `GET` (returns a JSON array of hidden ids) and `POST` with `{"hide": "<id>"}`. Set this only after the user has chosen the database and the access method.

## Report back

Say which database and table were written, how many scenes were saved and exported, which files changed, and whether the viewer check passed. If a step was skipped (for example, the database was not chosen yet), say so.
