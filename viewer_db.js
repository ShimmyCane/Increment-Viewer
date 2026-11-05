// Reads the reviews from the two Supabase databases and flags a review as rejected.
// The keys below are publishable keys (meant for public pages). Row-level security allows:
//   read: viewer_sets, viewer_scenes, viewer_rejected_scenes
//   insert only: viewer_rejected_scenes (a set id that exists in viewer_sets)
// Nothing else can be changed from the page.
(function () {
  var DBS = [
    { name: 'Architecture', url: 'https://xabgankckrcuhcgdolrg.supabase.co', key: 'sb_publishable_kncKodoYJZ6ByexwWM_TtQ_OpW68M5f' },
    { name: 'Family', url: 'https://twvqvutrcobedvuhnzxq.supabase.co', key: 'sb_publishable_eqUo8HEdEB1hMQM4CpSVqA_9i6b0qCo' }
  ];

  function request(db, path, opts) {
    opts = opts || {};
    var headers = { apikey: db.key, Authorization: 'Bearer ' + db.key };
    if (opts.body) headers['Content-Type'] = 'application/json';
    if (opts.prefer) headers.Prefer = opts.prefer;
    return fetch(db.url + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-cache'
    }).then(function (r) {
      return r.text().then(function (text) {
        if (!r.ok) throw new Error(db.name + ' database answered ' + r.status + (text ? ': ' + text.slice(0, 160) : ''));
        return text ? JSON.parse(text) : null;
      });
    });
  }

  function rejectedIds(db) {
    return request(db, 'viewer_rejected_scenes?select=scene_id').then(function (rows) {
      return rows.map(function (r) { return r.scene_id; });
    });
  }

  window.ViewerDB = {
    // Visible reviews from both databases. A rejected review is left out. One database failing does not hide the other.
    // Resolves to { sets: [{ id, db, label, title, subtitle }], errors: [message] }
    loadSets: function () {
      var errors = [];
      return Promise.all(DBS.map(function (db) {
        return Promise.all([
          request(db, 'viewer_sets?select=set_id,label,title,subtitle,sort_order&order=sort_order.asc'),
          rejectedIds(db)
        ]).then(function (res) {
          var rejected = res[1];
          return res[0]
            .filter(function (s) { return rejected.indexOf(s.set_id) === -1; })
            .map(function (s) { return { id: s.set_id, db: db, label: s.label, title: s.title, subtitle: s.subtitle || '' }; });
        }).catch(function (err) {
          errors.push(err.message);
          return [];
        });
      })).then(function (lists) {
        var sets = [];
        lists.forEach(function (list) { sets = sets.concat(list); });
        return { sets: sets, errors: errors };
      });
    },

    // Number of scenes per review id, from both databases. A database that fails counts as empty.
    countScenes: function () {
      var counts = {};
      return Promise.all(DBS.map(function (db) {
        return request(db, 'viewer_scenes?select=set_id').then(function (rows) {
          rows.forEach(function (r) { counts[r.set_id] = (counts[r.set_id] || 0) + 1; });
        }, function () { /* the list shows what it can */ });
      })).then(function () { return counts; });
    },

    // The scenes of one review, in order. Each is the item as the viewer shows it.
    loadScenes: function (set) {
      return request(set.db, 'viewer_scenes?select=position,item&set_id=eq.' + encodeURIComponent(set.id) + '&order=position.asc')
        .then(function (rows) { return rows.map(function (r) { return r.item; }); });
    },

    // Flag a review as rejected in its own database. Flagging twice is harmless.
    reject: function (set) {
      return request(set.db, 'viewer_rejected_scenes', {
        method: 'POST',
        body: { scene_id: set.id },
        prefer: 'resolution=ignore-duplicates,return=minimal'
      });
    }
  };
})();
