(function () {
  var ICON = {
    copy: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M3.5 10.5V3.5a1 1 0 0 1 1-1h6"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>',
    md: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1"/><path d="M4.5 10.5V6l2 2 2-2v4.5M11 6v4.5M9.5 9L11 10.5 12.5 9"/></svg>',
    ext: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 3.5H3.5v9h9V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"/></svg>'
  };

  function mdPathFor(pathname) {
    var clean = pathname.replace(/\/$/, '');
    if (clean === '' || clean === '/docs') return '/docs/index.md';
    if (!clean.startsWith('/docs/')) return null;
    return clean + '.md';
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function syncSearchLabel() {
    var btn = document.querySelector('site-search button[data-open-modal]');
    if (!btn) return;
    var label = btn.textContent.replace(/\s+/g, ' ').trim();
    if (label) btn.setAttribute('aria-label', label);
  }

  function init() {
    syncSearchLabel();

    var mdPath = mdPathFor(window.location.pathname);
    if (!mdPath || document.querySelector('.ru-md-actions')) return;

    var heading = document.querySelector('main h1, h1');
    if (!heading) return;

    var absUrl = window.location.origin + mdPath;
    var prompt = 'Read ' + absUrl + ' so I can ask questions about this page.';
    var chatgptUrl = 'https://chatgpt.com/?q=' + encodeURIComponent(prompt);
    var claudeUrl = 'https://claude.ai/new?q=' + encodeURIComponent(prompt);

    var wrap = el('div', 'ru-md-actions');

    // Split button: primary copy + caret.
    var bar = el('div', 'ru-md-bar');
    var primary = el('button', 'ru-md-primary', ICON.copy + '<span>Copy page</span>');
    primary.type = 'button';
    var caret = el('button', 'ru-md-caret', ICON.chevron);
    caret.type = 'button';
    caret.setAttribute('aria-haspopup', 'menu');
    caret.setAttribute('aria-expanded', 'false');
    caret.setAttribute('aria-label', 'More page actions');
    bar.append(primary, caret);

    // Menu.
    var menu = el('div', 'ru-md-menu');
    menu.setAttribute('role', 'menu');
    menu.hidden = true;

    var view = el('a', null, ICON.md + '<span>View as Markdown</span>');
    view.href = mdPath;
    view.target = '_blank';
    view.rel = 'noopener noreferrer';
    view.setAttribute('role', 'menuitem');

    var gpt = el('a', null, ICON.ext + '<span>Open in ChatGPT</span>');
    gpt.href = chatgptUrl;
    gpt.target = '_blank';
    gpt.rel = 'noopener noreferrer';
    gpt.setAttribute('role', 'menuitem');

    var claude = el('a', null, ICON.ext + '<span>Open in Claude</span>');
    claude.href = claudeUrl;
    claude.target = '_blank';
    claude.rel = 'noopener noreferrer';
    claude.setAttribute('role', 'menuitem');

    menu.append(view, gpt, claude);
    wrap.append(bar, menu);
    heading.insertAdjacentElement('afterend', wrap);

    // Behavior --------------------------------------------------------------
    var copyLabel = primary.querySelector('span');
    var resetTimer;

    primary.addEventListener('click', async function () {
      window.clearTimeout(resetTimer);
      try {
        var res = await fetch(mdPath);
        if (!res.ok) throw new Error('fetch failed');
        await navigator.clipboard.writeText(await res.text());
        primary.firstChild.outerHTML = ICON.check;
        copyLabel.textContent = 'Copied';
        primary.classList.add('is-copied');
      } catch (e) {
        window.open(mdPath, '_blank', 'noopener,noreferrer');
        return;
      }
      resetTimer = window.setTimeout(function () {
        primary.firstChild.outerHTML = ICON.copy;
        primary.querySelector('span').textContent = 'Copy page';
        primary.classList.remove('is-copied');
      }, 1500);
    });

    function openMenu() {
      menu.hidden = false;
      caret.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKey, true);
    }
    function closeMenu() {
      menu.hidden = true;
      caret.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onKey, true);
    }
    function onDocClick(e) {
      if (!wrap.contains(e.target)) closeMenu();
    }
    function onKey(e) {
      if (e.key === 'Escape') { closeMenu(); caret.focus(); }
    }

    caret.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    menu.addEventListener('click', function () { closeMenu(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  window.setTimeout(syncSearchLabel, 250);
})();
