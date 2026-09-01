// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 * @returns {Promise<Document|null>}
 */
async function fetchNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = document.implementation.createHTMLDocument('nav');
  doc.body.innerHTML = html;
  return doc.body;
}

/**
 * Close every open desktop dropdown.
 * @param {Element} navSections
 */
function closeAllSections(navSections) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
    const t = li.querySelector(':scope > .nav-drop-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggle the mobile menu open/closed.
 * @param {Element} nav
 * @param {Element} navSections
 * @param {Boolean|null} forceExpanded
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (expanded || isDesktop.matches) closeAllSections(navSections);
}

/**
 * Wire a top-level nav item that owns a dropdown/megamenu panel.
 * Desktop: hover opens, mouse-leave closes. Mobile: click toggles (accordion).
 * @param {Element} li
 * @param {Element} navSections
 */
function wireDropdown(li, navSections) {
  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');

  // Render the trigger label as a <button> for accessibility and so it is a
  // real, findable control (not a bare <p>).
  const label = li.querySelector(':scope > p, :scope > span');
  let trigger = label;
  if (label && !label.querySelector('a')) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-drop-toggle';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = label.textContent.trim();
    label.replaceWith(trigger);
  }

  const setExpanded = (open) => {
    li.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (trigger && trigger.tagName === 'BUTTON') {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  };

  li.addEventListener('mouseenter', () => {
    if (!isDesktop.matches) return;
    closeAllSections(navSections);
    setExpanded(true);
  });
  li.addEventListener('mouseleave', () => {
    if (!isDesktop.matches) return;
    setExpanded(false);
  });

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      // Desktop hover handles open; on mobile tapping toggles the panel in place.
      if (!isDesktop.matches) {
        e.preventDefault();
        const open = li.getAttribute('aria-expanded') === 'true';
        setExpanded(!open);
      }
    });
  }
}

/**
 * Reset nav to a clean desktop state (close everything).
 * @param {Element} nav
 * @param {Element} navSections
 */
function resetToDesktop(nav, navSections) {
  document.body.style.overflowY = '';
  nav.setAttribute('aria-expanded', 'false');
  const button = nav.querySelector('.nav-hamburger button');
  if (button) button.setAttribute('aria-label', 'Open navigation');
  closeAllSections(navSections);
}

/**
 * Loads and decorates the header nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNavFragment();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Promote megamenu column-heading <p> (a <p> whose sibling is a link list)
    // into <h3> so headings match the source markup semantically.
    navSections.querySelectorAll(':scope > ul > li > ul > li').forEach((colLi) => {
      const p = colLi.querySelector(':scope > p');
      const list = colLi.querySelector(':scope > ul');
      if (p && list && !p.querySelector('a')) {
        const h = document.createElement('h3');
        h.textContent = p.textContent.trim();
        p.replaceWith(h);
      }
    });

    // Promote a promo-card title (leading <strong> inside a single-link cell)
    // to <h3> so it reads as a heading, matching the source promo card.
    navSections.querySelectorAll(':scope > ul > li > ul > li').forEach((colLi) => {
      if (colLi.querySelector(':scope > ul')) return; // real column, handled above
      const strong = colLi.querySelector(':scope > p > a > strong, :scope > a > strong');
      if (strong) {
        const h = document.createElement('h3');
        h.textContent = strong.textContent.trim();
        strong.replaceWith(h);
        colLi.classList.add('nav-promo');
      }
    });

    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      if (li.querySelector(':scope > ul')) {
        // class hook so the panel is identifiable as a megamenu
        li.querySelector(':scope > ul').classList.add('nav-megamenu-panel');
        wireDropdown(li, navSections);
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // close on escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (isDesktop.matches) closeAllSections(navSections);
      else toggleMenu(nav, navSections, false);
    }
  });

  // viewport resize handling: close mobile menu + dropdowns when crossing breakpoints
  isDesktop.addEventListener('change', () => resetToDesktop(nav, navSections));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
