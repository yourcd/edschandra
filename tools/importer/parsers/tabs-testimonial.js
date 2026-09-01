/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (tabs): 2-column table. First row = block name.
 * Each subsequent row is one tab: [tab label cell, tab content cell].
 * Source: .tabs-content holds .tab-pane panels (content) and .tab-menu holds
 * .tab-menu-link buttons (labels). Pair panes to menu buttons by index.
 */
export default function parse(element, { document }) {
  const cells = [];

  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link'));

  panes.forEach((pane, i) => {
    // Label cell: the corresponding menu button's content, else fall back to
    // the person's name inside the pane.
    let labelCell = '';
    const button = menuButtons[i];
    if (button) {
      const inner = button.firstElementChild || button;
      labelCell = inner;
    } else {
      const name = pane.querySelector('strong');
      labelCell = name ? name.textContent.trim() : `Tab ${i + 1}`;
    }

    // Content cell: everything inside the pane's grid layout.
    const contentRoot = pane.querySelector('.grid-layout') || pane;
    const contentChildren = Array.from(contentRoot.children);
    const contentCell = contentChildren.length ? contentChildren : contentRoot;

    cells.push([labelCell, contentCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
