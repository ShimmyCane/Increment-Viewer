# Increment Viewer: schematic

Status: database-backed. The reviews live in two Supabase projects and the page only reads them.

## Purpose
A subject-neutral browser page for carefully reviewing a series of increments. It shows the scenes as a stacked slideshow and lists each one in a running log, with what changed and what still needs work. The page knows nothing about the subject. A review is rows in a database.

## Where the data lives
Two Supabase projects, both with the same three tables:

| Project | Holds | Project id |
|---|---|---|
| Architecture | architecture reviews (interiors, parks, aquariums, CAAM) | `xabgankckrcuhcgdolrg` |
| Family | science, fun and misc reviews (planets, Earth, hawk, car, robot, paper) | `twvqvutrcobedvuhnzxq` |

Tables (in each project):
- `viewer_sets`: one row per review. `set_id` (name), `label` (drop-down text), `title`, `subtitle`, `sort_order`.
- `viewer_scenes`: one row per scene. `set_id`, `position` (1-based order), `item` (JSON: `id`, `title`, `image`, `description`, `changes`, `gaps`, or `card`).
- `viewer_rejected_scenes`: one row per review that was deleted in the viewer. `scene_id` (the set id), `rejected_at`.

Row-level security is on. Public (anon) access is limited to:
- read: all three tables;
- insert: `viewer_rejected_scenes`, and only for a set id that exists in `viewer_sets`.

Nothing else can be written from the page. Changing or removing a rejected row needs the database owner.

## Files
- `viewer.html`: the slideshow, running log, scene drop-down and Delete scene button.
- `index.html`: the portfolio list, one card per visible review.
- `viewer_db.js`: the only code that talks to the databases (`window.ViewerDB`): `loadSets`, `countScenes`, `loadScenes`, `reject`. The publishable keys are in this file.
- `data/imported/`: the original data files. They were the source for the import and the page does not read them now.
- `renders/`: pictures used by the Growth, Paper Again and Visualize Image reviews.

## Use
Open `viewer.html`. With no `?set=`, it opens the first visible review.
- `viewer.html?set=<id>`: one review. An unknown or rejected id goes to the first visible review.
- `&step=<n>`: open on step n (1-based). The slideshow then waits for Play. As you step, the address changes to the step you are on, so the link can be shared.

## Delete scene (reject)
The Delete scene button (upper right) rejects the review on screen. It asks first. "Don't warn me again for 2 minutes" skips the warning for two minutes in this browser.

On confirm, the page inserts a row in `viewer_rejected_scenes` in that review's own database. The review is then removed from the drop-down and the index, and the viewer opens the next visible review with a note. If the database refuses the write, the review stays on screen and the page says why. Nothing is erased: the review and its scenes stay in the database, and a row in `viewer_rejected_scenes` can be deleted to bring a review back.

Rejected reviews are reviewed by hand now and then (see `todo.md`).

## Images
A scene's `image` is a path relative to `viewer.html`. Most images in the imported reviews point at folders outside this repo (for example `../Make 3D/renders/...`). Those show "Image not found" until the pictures are added here or moved to a storage bucket.

## Behaviour
- Slideshow: all views are stacked in one box and cross-fade. Back, Play/Pause and Next buttons. Dots jump to a view. Arrow keys work too. Auto-advance every 4 seconds.
- Running log: every item in order, scrollable on its own. The active item is highlighted and kept in view. Clicking an item jumps to it.
- Phone widths stack the log under the slideshow.
- A scene with no `image` but a `card` (`kicker`, `bars` of label, value, max, colour, and a `note`) shows a state card. Without either, the frame says "No picture for this step."
- If a database cannot be read, the page says which one, and the other database still shows.

## Out of scope (for now)
- Growth worlds (`../Growth/...`) are no longer loaded by the viewer. Their reviews, if wanted, need importing to a database.
- Notes and ratings are not saved from the page.
- No build step. No dependencies. The page needs internet access to the two Supabase projects.
