/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'faq',
  description: 'FAQ page: intro hero, expandable FAQ accordion, a text-only contact columns block, and a closing accent CTA banner.',
  urls: ['https://wknd-trendsetters.site/faq'],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(1) .faq-list'],
    },
    {
      name: 'columns-contact',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
  ],
  sections: [
    {
      id: 'rc1', name: 'Intro hero', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-intro'], defaultContent: [],
    },
    {
      id: 'rc2', name: 'FAQ accordion', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['accordion-faq'], defaultContent: [],
    },
    {
      id: 'rc3', name: "Let's connect", selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: ['columns-contact'], defaultContent: [],
    },
    {
      id: 'rc4', name: 'Closing CTA banner', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section .utility-text-align-center'],
    },
  ],
};

const parsers = {
  'hero-intro': heroIntroParser,
  'accordion-faq': accordionFaqParser,
  'columns-contact': columnsContactParser,
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
