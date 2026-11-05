# Increment Viewer: Claude pointer

Purpose: a subject-neutral template for reviewing a series of increments (slideshow plus running log). The reviews are rows in two Supabase projects; the page reads them.

- Design and data: `schematic.md`
- Open: `viewer.html` (first visible review) or `viewer.html?set=<id>`
- Add a review: save it to the Architecture or Family database with the `increment-scenes` skill (`.claude/skills/increment-scenes/SKILL.md`). No file change is needed.
- Keep the viewer generic. Subject-specific text belongs in the database rows only. The database access lives in `viewer_db.js`.
