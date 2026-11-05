---
name: increment-scenes
description: Save a project's increments (scenes) to the Increment Viewer's Supabase database (Architecture or Family), so the viewer shows them. Use when the user asks to save, add, publish or import scenes, views or increments to the Increment Viewer, or to create a review for a new project.
---

# Increment scenes: save to the Increment Viewer database

The viewer reads its reviews from two Supabase projects. This skill writes a new review (its scenes) into the right one. The page needs no file change.

Read `schematic.md` in the viewer repo first. It has the tables and the access rules.

## 1. Gather the review

Collect:
- `set_id`: a short name, lowercase with underscores (for example `caam`). Must be unique across both projects.
- `label`: the drop-down text, such as `CAAM: V0 to V10`.
- `title` and `subtitle`: shown at the top of the viewer.
- The scenes, in order. Each scene is an object:

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Short label, such as `V1` or `V02` |
| `title` | no | Short name |
| `image` | no | Path relative to `viewer.html`. Leave out for a state card |
| `description` | yes | What this version is |
| `changes` | yes | Array of strings: what changed |
| `gaps` | no | Array of strings: still to fix |
| `card` | no | `{ kicker, bars: [{label, value, max, color}], note }` for a step with no picture |

## 2. Pick the project

- **Architecture** (`xabgankckrcuhcgdolrg`): architecture, interiors, parks, aquariums, building studies.
- **Family** (`twvqvutrcobedvuhnzxq`): science, fun and misc reviews.

If it is not clear which one, ask the user once. Never put a review in a project another app owns: only write to `viewer_sets`, `viewer_scenes` and `viewer_rejected_scenes`.

## 3. Write the rows

Tables (both projects have them): `viewer_sets`, `viewer_scenes`, `viewer_rejected_scenes`. Use `execute_sql` on the chosen project, or the Supabase MCP's SQL tool. Write in one batch:

```sql
insert into public.viewer_sets (set_id, label, title, subtitle, sort_order)
values ($v$caam$v$, $v$CAAM: V0 to V10$v$, $v$CAAM, Exposition Park$v$, $v$One line about the review$v$,
        (select coalesce(max(sort_order), 0) + 1 from public.viewer_sets))
on conflict (set_id) do nothing;

insert into public.viewer_scenes (set_id, position, item) values
($v$caam$v$, 1, $v${"id":"V0","title":"References","image":"renders/caam/v0.png","description":"...","changes":["..."],"gaps":["..."]}$v$::jsonb),
($v$caam$v$, 2, $v${"id":"V1","title":"Site","description":"...","changes":["..."]}$v$::jsonb)
on conflict (set_id, position) do nothing;
```

Use dollar quoting (`$v$...$v$`) so quotes in the text need no escaping. Check that no text contains `$v$`.

If the review already exists and is being replaced: delete its `viewer_scenes` rows first, then insert the new ones, and show the row count before and after. Ask the user before replacing anything.

## 4. Check

Run these on the same project and report the numbers:

```sql
select (select count(*) from viewer_sets where set_id = 'caam') as set_rows,
       (select count(*) from viewer_scenes where set_id = 'caam') as scene_rows;
```

The scene count must equal the number of scenes you wrote. Optionally open `viewer.html?set=<set_id>` in a browser that can reach the project and check the slideshow.

## 5. Rejected reviews

A review the owner deleted in the viewer has a row in `viewer_rejected_scenes` and is hidden from the page. Do not delete those rows unless the user asks. `todo.md` in the repo has the monthly review of them.

## Report back

Say which project and tables were written, the set id, how many scenes were saved and how many are in the database, and whether the check passed. If a step was skipped, say so.
