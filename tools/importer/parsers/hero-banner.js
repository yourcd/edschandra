/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Block library convention (hero): 1-column, 3-row table.
 *   Row 1: block name.
 *   Row 2 (1 cell): background image (optional).
 *   Row 3 (1 cell): title, subheading, CTA (optional).
 * Source: grid > relative container with a .cover-image background and a
 * .card-body holding heading, subheading and a button-group CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Background image row (optional).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Content row (single cell holding all text + CTA).
  const contentCell = [];
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  if (heading) contentCell.push(heading);
  const subheading = element.querySelector('.subheading, p');
  if (subheading) contentCell.push(subheading);
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!heading && !subheading && !ctas.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
