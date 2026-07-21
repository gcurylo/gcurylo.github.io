(function () {
  'use strict';

  var TABS = ['about', 'research', 'cv'];
  var resetResearchTopics = null;

  function showTab(name) {
    if (TABS.indexOf(name) === -1) { name = 'about'; }
    TABS.forEach(function (t) {
      var section = document.getElementById(t);
      var link = document.querySelector('[data-tab="' + t + '"]');
      var isActive = (t === name);
      if (section) { section.classList.toggle('active', isActive); }
      if (link) { link.classList.toggle('selected', isActive); }
    });
    if (name !== 'research' && resetResearchTopics) {
      resetResearchTopics();
    }
  }

  function currentTabFromHash() {
    return (location.hash || '').replace('#', '');
  }

  // --- Email assembled at runtime so it never appears in the served HTML ---
  function buildEmail() {
    var el = document.getElementById('email-link');
    if (!el) { return; }
    var addr;
    try {
      addr = atob(el.getAttribute('data-e') || '');
    } catch (e) {
      return;
    }
    if (!addr) { return; }
    el.setAttribute('href', 'mailto:' + addr);
    el.setAttribute('title', addr);
  }

  // --- Research topic tiles: click collapses tiles into tabs and shows text ---
  function initResearchTiles() {
    var contentBox = document.querySelector('#content_box.research');
    var tilesBox = document.getElementById('research-tiles');
    var panelsBox = document.getElementById('research-panels');
    if (!tilesBox || !panelsBox) { return; }

    var tiles = tilesBox.querySelectorAll('.tile');
    var panels = panelsBox.querySelectorAll('.research-panel');

    function selectTopic(topic) {
      tilesBox.classList.add('is-compact');
      if (contentBox) { contentBox.classList.add('topic-active'); }
      tiles.forEach(function (tile) {
        tile.classList.toggle('active', tile.getAttribute('data-topic') === topic);
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.getAttribute('data-topic') === topic);
      });
    }

    function resetTopics() {
      tilesBox.classList.remove('is-compact');
      if (contentBox) { contentBox.classList.remove('topic-active'); }
      tiles.forEach(function (tile) { tile.classList.remove('active'); });
      panels.forEach(function (panel) { panel.classList.remove('active'); });
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        selectTopic(tile.getAttribute('data-topic'));
      });
      tile.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectTopic(tile.getAttribute('data-topic'));
        }
      });
    });

    panelsBox.querySelectorAll('.research-back').forEach(function (btn) {
      btn.addEventListener('click', resetTopics);
    });

    resetResearchTopics = resetTopics;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Nav clicks
    document.querySelectorAll('[data-tab]').forEach(function (link) {
      link.addEventListener('click', function (ev) {
        ev.preventDefault();
        var name = link.getAttribute('data-tab');
        location.hash = name;   // triggers hashchange -> showTab
      });
    });

    window.addEventListener('hashchange', function () {
      showTab(currentTabFromHash());
    });

    showTab(currentTabFromHash());
    buildEmail();
    initResearchTiles();
  });
})();
