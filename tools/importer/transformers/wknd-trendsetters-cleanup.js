/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * NOTE: The intro hero is authored as <header class="section secondary-section">
 * INSIDE <main>. Do NOT remove bare `header` — that would delete authorable content.
 * The site chrome (nav/footer) lives OUTSIDE <main> as `.navbar` / `footer.footer`.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable site chrome (found in cleaned.html: outside <main>).
    // Removed before parsing so block parsers never absorb it.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',        // line 1: "Skip to main content" anchor
      '.navbar',           // line 1: global nav shell + mega menu
      'footer.footer',     // line 98: global site footer
      '.breadcrumbs',      // line 47: breadcrumb nav inside the case-study section (non-authorable)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Defensive removal of any leftover site chrome / non-authorable elements.
    WebImporter.DOMUtils.remove(element, [
      'nav',               // any residual navigation
      '.skip-link',
      '.navbar',
      'footer.footer',
      '.breadcrumbs',
    ]);

    // Strip framework build attributes (found in cleaned.html: data-astro-cid-*).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) el.removeAttribute(attr.name);
      });
    });
  }
}
