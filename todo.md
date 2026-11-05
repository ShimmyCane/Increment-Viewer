# To do

## Review rejected reviews now and then
A review deleted in the Increment Viewer is flagged in its own database's `viewer_rejected_scenes` table (Architecture or Family). It is hidden, not erased.
Every month or so, open that table in each project and decide, review by review:

- **Bring back:** delete the row, so the review shows again.
- **Remove for good:** delete its rows in `viewer_scenes`, then its row in `viewer_sets` and its row in `viewer_rejected_scenes`.
- **Keep:** leave the row.

Last reviewed: never

## Pictures
Most scene images point at folders outside this repo (`../Make 3D/renders/...`, `../Quick-Detail/...`), so they show "Image not found" in the viewer. Decide where the pictures should live (the repo `renders/` folder, or a Supabase storage bucket) and move them, then update the `image` paths in `viewer_scenes`.
