# To do

## Review rejected scenes now and then
Scenes deleted in the Increment Viewer are kept in the Architecture database table `viewer_rejected_scenes` (hidden, not erased).
Every month or so, open that table and decide, scene by scene:

- **Bring back:** delete the row, so the scene shows again.
- **Remove for good:** delete the scene's rows in `viewer_scenes` and the data file in `data/`, then remove its line in `data/sets.js`.
- **Keep:** leave the row.

Last reviewed: never
