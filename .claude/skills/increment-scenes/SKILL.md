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

## 2. The database

The scenes live in the **Architecture** Supabase project (`xabgankckrcuhcgdolrg`, us-east-2). The family project is not used for scenes.

Before writing, check the target. Never write to a table another app owns. Register any new table in `table_index` (Architecture) with the project name `Increment Viewer`, so other apps can see who owns it.

## 3. Save to the database

Tables (created in the Architecture project, RLS on, no public policies):

- `viewer_scenes(set_id text, position integer, item jsonb, updated_at timestamptz)`, primary key `(set_id, position)`. One row per scene. `set_id` is the data file name (for example `living_room`), `position` is the 1-based order, `item` is the scene exactly as in the data file.
- `viewer_rejected_scenes(scene_id text primary key, rejected_at timestamptz)`. A scene the user deleted in the viewer. `scene_id` is the set id, or `world:<id>` for a Growth world. Hiding never erases the scene; this table is only the list of hidden scenes.

Use one set of rows per review. Write the scenes as one batch: delete the old rows for `set_id`, then insert the new ones. Show the user the row count before and after.

RLS is on, so the viewer's public key cannot read or write these tables by itself. Access goes through an edge function or a policy the user agrees to. Do not open them to everyone without asking.

Rejected scenes are reviewed by hand now and then (see `todo.md`). Do not delete rows from `viewer_rejected_scenes` unless the user asks.

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
