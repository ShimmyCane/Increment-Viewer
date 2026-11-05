// Hidden scenes. The viewer's Delete scene button hides a scene: the data file is kept, nothing is erased.
// The hidden list is kept in the back end when one is set (window.VIEWER_BACKEND.hiddenUrl in data/sets.js),
// and always in this browser too, so a scene hidden with no back end stays hidden here.
// Back-end contract (hiddenUrl):
//   GET  -> JSON array of hidden scene ids, e.g. ["living_room", "world:growth_paper"]
//   POST -> JSON body {"hide": "<id>"}; any 2xx reply means saved.
// The warning can be muted for 2 minutes (a clock time in this browser).
(function () {
  var LOCAL_KEY = 'incrementViewer.hiddenScenes';
  var MUTE_KEY = 'incrementViewer.muteDeleteWarningUntil';
  var MUTE_MS = 2 * 60 * 1000;

  function isId(x) { return typeof x === 'string' && /^(world:)?[a-z0-9_]+$/i.test(x); }

  function readLocal() {
    try {
      var v = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      return Array.isArray(v) ? v.filter(isId) : [];
    } catch (e) { return []; }
  }

  var hidden = readLocal();

  function writeLocal() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(hidden)); } catch (e) { /* blocked storage: hidden for this page only */ }
  }

  function backendUrl() {
    var b = window.VIEWER_BACKEND;
    return b && typeof b.hiddenUrl === 'string' ? b.hiddenUrl : '';
  }

  function add(id) { if (isId(id) && hidden.indexOf(id) === -1) hidden.push(id); }

  window.HiddenScenes = {
    isHidden: function (id) { return hidden.indexOf(id) !== -1; },

    visible: function (sets) {
      return sets.filter(function (s) { return !window.HiddenScenes.isHidden(s.id); });
    },

    // Merge the back end's list into this browser's list. Always resolves, even if the back end is down.
    load: function () {
      var url = backendUrl();
      if (!url || typeof fetch !== 'function') return Promise.resolve(hidden);
      return fetch(url, { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
        .then(function (list) {
          if (Array.isArray(list)) { list.forEach(function (id) { add(id); }); writeLocal(); }
          return hidden;
        })
        .catch(function () { return hidden; });
    },

    // Hide a scene here, then in the back end. Resolves to:
    //   'backend' = saved in the back end, 'local' = no back end set, 'failed' = back end refused (still hidden here).
    hide: function (id) {
      add(id);
      writeLocal();
      var url = backendUrl();
      if (!url || typeof fetch !== 'function') return Promise.resolve('local');
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hide: id })
      }).then(function (r) { return r.ok ? 'backend' : 'failed'; }, function () { return 'failed'; });
    },

    isMuted: function () {
      try { return Date.now() < Number(localStorage.getItem(MUTE_KEY) || 0); } catch (e) { return false; }
    },

    mute: function () {
      try { localStorage.setItem(MUTE_KEY, String(Date.now() + MUTE_MS)); } catch (e) { /* no storage: the warning shows again */ }
    }
  };
})();
