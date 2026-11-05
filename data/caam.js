// Review data for the California African American Museum (CAAM) AI draft: 10 iterations drawn in Quick Detail
// (tools/caam.js) from OpenStreetMap and public photos. Not surveyed.
// Images are read relative to viewer.html, so they go up one folder into the Quick Detail project.
window.REVIEW_DATA = {
  title: "CAAM, Exposition Park: research, plans, elevations, isometric (V0 to V10)",
  subtitle: "California African American Museum (1984, Jack Haywood and Vince Proby), Los Angeles. Footprint traced from OpenStreetMap (46,406 sf traced; 44,000 sf published); heights and uses assumed from public photos. AI draft at 1/4\"=1'-0\". Replay the strokes in Quick Detail: docs/caam/caam-history.html. Log: docs/caam/LOG.md.",
  items: [
    {
      id: "V0", title: "References",
      image: "../Quick-Detail/docs/caam/refs/osm-z19-exposition-park.png",
      description: "OpenStreetMap at z19 (© OpenStreetMap contributors, ODbL): CAAM between State Drive, Figueroa Street and the Air and Space Center, with the plaza meeting it on a 45-degree face. Wikipedia gave the architects, date, 44,000 sf and the room list; four Commons photos gave the materials.",
      changes: ["Overpass failed (connection dropped), so the footprint was traced from the tile pixels", "Commons API rate-limited, so photos came from thumbnail URLs built from the file names"],
      gaps: ["No photo of the Figueroa side", "No interior photo of the sculpture court", "Only one photo licence read"]
    },
    {
      id: "V1", title: "Site",
      image: "../Quick-Detail/docs/caam/review/iter-01.png",
      description: "Site at 1/4 of the sheet scale: State Drive, Figueroa Street, 38th Street, the Air and Space Center, the Science Center buildings, the plaza and the garden path to the south lot.",
      changes: ["Footprint and neighbours traced from OSM"],
      gaps: ["Neighbour outlines approximate"]
    },
    {
      id: "V2", title: "Footprint shell",
      image: "../Quick-Detail/docs/caam/review/iter-02.png",
      description: "The traced footprint as a ground shell: 250 by 349 ft, one 335 ft wall at 45 degrees on the plaza, the entry drum, the west pavilion, the stepped Figueroa wall and the loading bay.",
      changes: ["16 in block walls (assumed)", "Glazed spans and the drum's four columns"],
      gaps: ["Tracing within about 2 ft"]
    },
    {
      id: "V3", title: "Ground floor program",
      image: "../Quick-Detail/docs/caam/review/iter-03.png",
      description: "Rooms from the published list, each with its traced area: three galleries, the theater gallery, lobby, sculpture court (about 12,800 of the published 14,000 sf), library, offices, conference room, loading.",
      changes: ["Partitions and room areas", "Tower outline dashed", "Bleacher steps"],
      gaps: ["Placement of every room is assumed"]
    },
    {
      id: "V4", title: "Roof plan",
      image: "../Quick-Detail/docs/caam/review/iter-04.png",
      description: "Roof heights (assumed), the glazed court roof rising from the plaza, the three tower tiers, the drum canopy and section line A.",
      changes: ["Glazing bars and slope arrow on the court roof", "Section line A at x = 180 ft"]
    },
    {
      id: "V5", title: "Plaza elevation, massing",
      image: "../Quick-Detail/docs/caam/review/iter-05.png",
      description: "Looking south-east at the 45-degree face. Drawn from one block model with a painter's algorithm: solid-tone faces far to near, so nearer faces hide farther ones.",
      changes: ["Block model and painter's renderer"]
    },
    {
      id: "V6", title: "Plaza elevation, detail",
      image: "../Quick-Detail/docs/caam/review/iter-06.png",
      description: "Curtain walls with block piers, split-face coursing, the drum and its columns, bleacher steps, the tower and the court roof seen behind. Chosen as the face of the isometric.",
      changes: ["Curtain walls and mullions", "Block coursing", "Columns", "Callouts in two staggered rows (review pass 2)"]
    },
    {
      id: "V7", title: "East elevation and section A",
      image: "../Quick-Detail/docs/caam/review/iter-07.png",
      description: "The Figueroa Street side, with the court roof and tower seen over the offices, and section A through two galleries, the sculpture court's space-frame roof, the plaza glass and the steps.",
      changes: ["East elevation from the same model", "Section A"],
      gaps: ["The Figueroa side is invented: there is no photo of it", "Level marks were first on the wrong end (fixed in pass 2)"]
    },
    {
      id: "V8", title: "Option B: the refresh (branch from V6)",
      image: "../Quick-Detail/docs/caam/review/iter-08.png",
      description: "The same plaza elevation in its later look from the photos: a white drum with CAAM lettering, darker block and a yellow banner.",
      changes: ["Second palette on the same model"],
      gaps: ["Dates of the refresh not confirmed", "White colonnade (photos p4, p7) not placed"]
    },
    {
      id: "V9", title: "Isometric massing (branch from V7)",
      image: "../Quick-Detail/docs/caam/review/iter-09.png",
      description: "From the north-west, over the plaza, so the worked-out face reads square-on with the court roof, tower and offices behind.",
      changes: ["Isometric projection of the same model"]
    },
    {
      id: "V10", title: "Isometric, detailed (final)",
      image: "../Quick-Detail/docs/caam/review/iter-10.png",
      description: "Curtain walls, block, drum and columns, bleacher steps and the court's glazing bars.",
      changes: ["Detail layer on the isometric", "Callouts"],
      gaps: ["Verify against the State's drawings and photos before use"]
    }
  ]
};
