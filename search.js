// ============================================================
//  CineVault — Global Search Engine
//  Include this on every page AFTER movies.js
//  <script src="movies.js"></script>
//  <script src="search.js"></script>
// ============================================================

(function() {

  // ── Build search index from MOVIES array ──────────────────
  function buildIndex() {
    return MOVIES.map(function(m) {
      return {
        movie: m,
        searchText: [
          m.title,
          m.director,
          String(m.year),
          m.genres.join(' '),
          m.cast.join(' '),
          m.synopsis,
          m.country,
          m.language
        ].join(' ').toLowerCase()
      };
    });
  }

  // ── Score a movie against a query ─────────────────────────
  function scoreMovie(entry, query) {
    var q = query.toLowerCase().trim();
    if (!q) return 0;
    var score = 0;
    var title = entry.movie.title.toLowerCase();

    // Exact title match = highest priority
    if (title === q) score += 100;
    // Title starts with query
    else if (title.startsWith(q)) score += 60;
    // Title contains query
    else if (title.includes(q)) score += 40;
    // Director match
    if (entry.movie.director.toLowerCase().includes(q)) score += 30;
    // Year match
    if (String(entry.movie.year).includes(q)) score += 20;
    // Genre match
    if (entry.movie.genres.join(' ').toLowerCase().includes(q)) score += 20;
    // Cast match
    if (entry.movie.cast.join(' ').toLowerCase().includes(q)) score += 15;
    // General text match
    if (entry.searchText.includes(q)) score += 5;

    return score;
  }

  // ── Search function — returns sorted results ───────────────
  function searchMovies(query) {
    if (!query || query.trim().length < 1) return [];
    var index = buildIndex();
    var results = [];
    index.forEach(function(entry) {
      var score = scoreMovie(entry, query);
      if (score > 0) results.push({ movie: entry.movie, score: score });
    });
    results.sort(function(a, b) { return b.score - a.score; });
    return results.map(function(r) { return r.movie; });
  }

  // ── Build the search overlay HTML ─────────────────────────
  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'cv-search-overlay';
    overlay.innerHTML =
      '<div id="cv-search-backdrop"></div>' +
      '<div id="cv-search-panel">' +
        '<div id="cv-search-header">' +
          '<div id="cv-search-input-wrap">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
            '<input id="cv-search-input" type="text" placeholder="Search by title, director, genre, year…" autocomplete="off">' +
            '<button id="cv-search-clear" title="Clear">✕</button>' +
          '</div>' +
          '<button id="cv-search-close">Cancel</button>' +
        '</div>' +
        '<div id="cv-search-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  // ── Render one result card ─────────────────────────────────
  function renderCard(movie) {
    var card = document.createElement('a');
    card.className = 'cv-result-card';
    card.href = getMovieUrl(movie);

    var posterHtml = movie.poster
      ? '<img src="' + movie.poster + '" alt="' + movie.title + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
      : '';
    var phDisplay = movie.poster ? 'none' : 'flex';

    card.innerHTML =
      '<div class="cv-result-thumb">' +
        posterHtml +
        '<div class="cv-result-ph" style="display:' + phDisplay + '">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
        '</div>' +
      '</div>' +
      '<div class="cv-result-info">' +
        '<div class="cv-result-title">' + movie.title + '</div>' +
        '<div class="cv-result-meta">' +
          '<span>' + movie.year + '</span>' +
          '<span class="cv-dot"></span>' +
          '<span>' + movie.genres.join(', ') + '</span>' +
          '<span class="cv-dot"></span>' +
          '<span class="cv-result-rating">★ ' + movie.rating + '</span>' +
        '</div>' +
        '<div class="cv-result-director">Dir. ' + movie.director + '</div>' +
      '</div>' +
      '<div class="cv-result-play">' +
        '<a href="' + getWatchUrl(movie) + '" class="cv-play-btn" onclick="event.stopPropagation()">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
          'Watch' +
        '</a>' +
      '</div>';
    return card;
  }

  // ── Inject styles ──────────────────────────────────────────
  function injectStyles() {
    var style = document.createElement('style');
    style.textContent =
      '#cv-search-overlay{position:fixed;inset:0;z-index:9999;display:none}' +
      '#cv-search-overlay.open{display:block}' +
      '#cv-search-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}' +
      '#cv-search-panel{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;background:#12121a;border-bottom:1px solid rgba(255,255,255,.08);border-left:1px solid rgba(255,255,255,.06);border-right:1px solid rgba(255,255,255,.06);border-radius:0 0 16px 16px;box-shadow:0 24px 60px rgba(0,0,0,.6);max-height:85vh;display:flex;flex-direction:column;overflow:hidden}' +
      '#cv-search-header{padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:12px;flex-shrink:0}' +
      '#cv-search-input-wrap{flex:1;display:flex;align-items:center;gap:10px;background:#1a1a26;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:0 14px;height:46px}' +
      '#cv-search-input-wrap svg{color:#888899;flex-shrink:0}' +
      '#cv-search-input{flex:1;background:none;border:none;outline:none;color:#f0f0f5;font-size:16px;font-family:inherit}' +
      '#cv-search-input::placeholder{color:#888899}' +
      '#cv-search-clear{background:none;border:none;color:#888899;cursor:pointer;font-size:14px;padding:4px;line-height:1;display:none}' +
      '#cv-search-clear.visible{display:block}' +
      '#cv-search-close{background:none;border:none;color:#888899;cursor:pointer;font-size:14px;font-family:inherit;white-space:nowrap;padding:8px 4px;transition:color .2s}' +
      '#cv-search-close:hover{color:#f0f0f5}' +
      '#cv-search-results{overflow-y:auto;flex:1;padding:8px 0}' +
      '#cv-search-results::-webkit-scrollbar{width:4px}' +
      '#cv-search-results::-webkit-scrollbar-thumb{background:#1a1a26;border-radius:4px}' +
      '.cv-result-card{display:flex;align-items:center;gap:14px;padding:10px 20px;text-decoration:none;color:#f0f0f5;transition:background .15s;cursor:pointer}' +
      '.cv-result-card:hover{background:rgba(255,255,255,.04)}' +
      '.cv-result-thumb{flex-shrink:0;width:48px;aspect-ratio:2/3;border-radius:6px;overflow:hidden;background:#1a1a26}' +
      '.cv-result-thumb img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.cv-result-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center}' +
      '.cv-result-ph svg{opacity:.3}' +
      '.cv-result-info{flex:1;min-width:0}' +
      '.cv-result-title{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}' +
      '.cv-result-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:#888899;margin-bottom:2px}' +
      '.cv-dot{width:3px;height:3px;border-radius:50%;background:#888899;flex-shrink:0}' +
      '.cv-result-rating{color:#f4c430;font-weight:600}' +
      '.cv-result-director{font-size:12px;color:#666677}' +
      '.cv-result-play{flex-shrink:0}' +
      '.cv-play-btn{display:inline-flex;align-items:center;gap:5px;background:#e63946;color:#fff;text-decoration:none;font-size:12px;font-weight:600;padding:6px 12px;border-radius:6px;transition:background .2s;white-space:nowrap}' +
      '.cv-play-btn:hover{background:#ff6b6b}' +
      '.cv-empty{padding:48px 20px;text-align:center;color:#888899}' +
      '.cv-empty h3{font-family:"Bebas Neue",sans-serif;font-size:24px;letter-spacing:1px;margin-bottom:6px;color:#f0f0f5}' +
      '.cv-empty p{font-size:14px}' +
      '.cv-hint{padding:24px 20px;color:#888899;font-size:13px}' +
      '.cv-hint strong{color:#f0f0f5;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:10px}' +
      '.cv-hint-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}' +
      '.cv-hint-pill{background:#1a1a26;border:1px solid rgba(255,255,255,.07);border-radius:999px;padding:4px 12px;font-size:12px;color:#888899;cursor:pointer;transition:all .15s}' +
      '.cv-hint-pill:hover{background:#e63946;border-color:#e63946;color:#fff}' +
      '.cv-result-count{padding:8px 20px 4px;font-size:12px;color:#666677}' +
      '@media(max-width:680px){#cv-search-panel{max-width:100%;border-radius:0;border-left:none;border-right:none}}';
    document.head.appendChild(style);
  }

  // ── Wire up all search triggers on page ───────────────────
  function wireSearchTriggers(openFn) {
    // Any existing search input (nav bar etc.)
    document.querySelectorAll('input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="search"], #nav-search, #search-input').forEach(function(input) {
      input.addEventListener('focus', function(e) {
        e.preventDefault();
        input.blur();
        openFn(input.value || '');
      });
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          openFn(input.value || '');
        }
      });
    });

    // Keyboard shortcut: / or Ctrl+K
    document.addEventListener('keydown', function(e) {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k'))) {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          openFn('');
        }
      }
    });
  }

  // ── Main init ─────────────────────────────────────────────
  function init() {
    injectStyles();
    var overlay = createOverlay();
    var input   = document.getElementById('cv-search-input');
    var results = document.getElementById('cv-search-results');
    var clearBtn = document.getElementById('cv-search-clear');
    var closeBtn = document.getElementById('cv-search-close');
    var backdrop = document.getElementById('cv-search-backdrop');
    var debounceTimer;

    // Hint content (shown when input is empty)
    var genres = ['Drama','Comedy','Horror','Sci-Fi','Documentary','Action','Travel'];
    function showHint() {
      var pills = genres.map(function(g) {
        return '<span class="cv-hint-pill" data-genre="' + g + '">' + g + '</span>';
      }).join('');
      results.innerHTML =
        '<div class="cv-hint">' +
          '<strong>Browse by genre</strong>' +
          '<div class="cv-hint-pills">' + pills + '</div>' +
        '</div>';
      results.querySelectorAll('.cv-hint-pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
          input.value = pill.dataset.genre;
          clearBtn.classList.add('visible');
          runSearch(pill.dataset.genre);
        });
      });
    }

    function runSearch(query) {
      if (!query || query.trim() === '') { showHint(); return; }
      var found = searchMovies(query);
      if (found.length === 0) {
        results.innerHTML =
          '<div class="cv-empty">' +
            '<h3>No results</h3>' +
            '<p>Try a different title, director, or genre.</p>' +
          '</div>';
        return;
      }
      results.innerHTML = '<div class="cv-result-count">' + found.length + ' film' + (found.length !== 1 ? 's' : '') + ' found</div>';
      found.forEach(function(movie) {
        results.appendChild(renderCard(movie));
      });
    }

    function openSearch(initialQuery) {
      overlay.classList.add('open');
      input.value = initialQuery || '';
      setTimeout(function(){ input.focus(); }, 50);
      if (initialQuery) {
        clearBtn.classList.add('visible');
        runSearch(initialQuery);
      } else {
        clearBtn.classList.remove('visible');
        showHint();
      }
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      overlay.classList.remove('open');
      input.value = '';
      results.innerHTML = '';
      document.body.style.overflow = '';
    }

    input.addEventListener('input', function() {
      var q = input.value;
      clearBtn.classList.toggle('visible', q.length > 0);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function(){ runSearch(q); }, 120);
    });

    clearBtn.addEventListener('click', function() {
      input.value = '';
      clearBtn.classList.remove('visible');
      input.focus();
      showHint();
    });

    closeBtn.addEventListener('click', closeSearch);
    backdrop.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSearch();
    });

    wireSearchTriggers(openSearch);

    // Expose globally so any page can call CineVaultSearch.open()
    window.CineVaultSearch = { open: openSearch, close: closeSearch };
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
