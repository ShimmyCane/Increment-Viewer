# Increment Viewer: brief

## Goal and boundaries
A subject-neutral page to review a series of increments: a stacked slideshow and a scrollable running log of descriptions and changes. The subject lives in a data file, so the viewer can be reused.

## Current state
- `viewer.html` plus one data file per project in `data/`, listed once each in `data/sets.js`.
- Merged the split Earth (V02 to V23), planet (V02 to V06) and Adventure Coaster Park (V01 to V16) files into one file each. The nine originals are in `data/archive/`.
- Verified in headless Chromium: ten drop-down entries, no page errors, and log entry counts of 22, 40 and 16 matching the data.
- Added `data/caam.js` (CAAM, Exposition Park, V0 to V10): renders read from `../Quick-Detail/docs/caam/`. Verified in headless Chromium: 11 images load, no page errors.
- Known gap: the Adventure Coaster V16 render (`Make 3D/renders/adventure_park_compact/v16.png`) does not exist yet, so its frame shows the path.
- Unverified: iPad and other browsers.

- Internal note: copied renders into this repo. `renders/growth/` holds the 10 Growth renders (`growth_3d_01..10.png`) from ShimmyCane/growth `renders/`. `renders/paper_again/` holds the 10 Paper Again renders (`paper_again_01..10.png`) from ShimmyCane/growth `Paper Again/renders/`. `data/growth_paper.js` and `data/paper_again.js` now point there. Living Room Scene and Make 3D renders are not copied yet (Make-3D repo attach was denied).

## Next steps
- Render Adventure Coaster V16 in Make 3D, or drop the item from its data file.
- Add a data file only for a new project, not a new time span of an existing one.
- Consider a link from the root `index.html` Architecture section (added in this change).

- Added three reviews to the Family database (`vi_kitchen_p1`, `_p2`, `_p3`): the Visualize Image process run three times on one photo (7 scenes each). Images are in `renders/visualize_image/p1..p3/` (flat drawings only; the source photo stays private in the Learning-to-Draw repo). Source and engine: ShimmyCane/Learning-to-Draw, `visualize-image/`.
