/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (accordion): 2-column table. First row = block name.
 * Each subsequent row is an accordion item: [title cell, content cell].
 * Source uses <details class="faq-item"> with <summary class="faq-question"> (title)
 * and <div class="faq-answer"> (content).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each accordion item comes from a <details> / .faq-item element.
  const items = element.querySelectorAll('details.faq-item, details, .faq-item');

  items.forEach((item) => {
    // Title: prefer the summary's inner text span, fall back to the summary itself.
    const summary = item.querySelector('summary, .faq-question');
    let titleCell = '';
    if (summary) {
      const titleSpan = summary.querySelector('span');
      titleCell = titleSpan || summary.textContent.trim();
    }

    // Content: the answer container (may hold multiple elements).
    const answer = item.querySelector('.faq-answer');
    let contentCell = '';
    if (answer) {
      const children = Array.from(answer.children);
      contentCell = children.length ? children : answer.textContent.trim();
    }

    // Only add rows that have at least a title.
    if (titleCell) {
      cells.push([titleCell, contentCell]);
    }
  });

  // Empty-block guard: if no accordion items were found, unwrap gracefully.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
