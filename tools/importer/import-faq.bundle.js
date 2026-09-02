/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-faq.js
  var import_faq_exports = {};
  __export(import_faq_exports, {
    default: () => import_faq_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const images = Array.from(element.querySelectorAll("img.cover-image, img"));
    if (images.length) {
      cells.push([images]);
    }
    const contentCell = [];
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    if (heading) contentCell.push(heading);
    const subheading = element.querySelector(".subheading, p");
    if (subheading) contentCell.push(subheading);
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    contentCell.push(...ctas);
    if (!heading && !subheading && !ctas.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const items = element.querySelectorAll("details.faq-item, details, .faq-item");
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let titleCell = "";
      if (summary) {
        const titleSpan = summary.querySelector("span");
        titleCell = titleSpan || summary.textContent.trim();
      }
      const answer = item.querySelector(".faq-answer");
      let contentCell = "";
      if (answer) {
        const children = Array.from(answer.children);
        contentCell = children.length ? children : answer.textContent.trim();
      }
      if (titleCell) {
        cells.push([titleCell, contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse3(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const row = columns.map((col) => {
      const children = Array.from(col.childNodes).filter((n) => {
        return n.nodeType === 1 || n.nodeType === 3 && n.textContent.trim();
      });
      if (children.length === 1) return children[0];
      return children.length ? children : "";
    });
    if (!row.length || row.every((c) => c === "")) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // line 1: "Skip to main content" anchor
        ".navbar",
        // line 1: global nav shell + mega menu
        "footer.footer",
        // line 98: global site footer
        ".breadcrumbs"
        // line 47: breadcrumb nav inside the case-study section (non-authorable)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav",
        // any residual navigation
        ".skip-link",
        ".navbar",
        "footer.footer",
        ".breadcrumbs"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) el.removeAttribute(attr.name);
        });
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-faq.js
  var PAGE_TEMPLATE = {
    name: "faq",
    description: "FAQ page: intro hero, expandable FAQ accordion, a text-only contact columns block, and a closing accent CTA banner.",
    urls: ["https://wknd-trendsetters.site/faq"],
    blocks: [
      {
        name: "hero-intro",
        instances: ["#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(1) .faq-list"]
      },
      {
        name: "columns-contact",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.tablet-1-column.grid-gap-xxl"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Intro hero",
        selector: "#main-content > header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-intro"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "FAQ accordion",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Let's connect",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["columns-contact"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Closing CTA banner",
        selector: "#main-content > section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: ["#main-content > section.section.accent-section .utility-text-align-center"]
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "accordion-faq": parse2,
    "columns-contact": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_faq_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_faq_exports);
})();
