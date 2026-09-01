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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(":scope > a.article-card, :scope > .article-card, :scope > a");
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img");
      const contentCell = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) contentCell.push(meta);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const href = card.getAttribute("href");
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        contentCell.push(heading);
      } else if (href) {
        const link = document2.createElement("a");
        link.href = href;
        link.textContent = "Read more";
        contentCell.push(link);
      }
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const items = element.querySelectorAll(":scope > div");
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (img) {
        cells.push([img, ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse4(element, { document: document2 }) {
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    if (bgImage) {
      cells.push([bgImage]);
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-intro.js
  function parse6(element, { document: document2 }) {
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

  // tools/importer/parsers/tabs-testimonial.js
  function parse7(element, { document: document2 }) {
    const cells = [];
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu-link"));
    panes.forEach((pane, i) => {
      let labelCell = "";
      const button = menuButtons[i];
      if (button) {
        const inner = button.firstElementChild || button;
        labelCell = inner;
      } else {
        const name = pane.querySelector("strong");
        labelCell = name ? name.textContent.trim() : `Tab ${i + 1}`;
      }
      const contentRoot = pane.querySelector(".grid-layout") || pane;
      const contentChildren = Array.from(contentRoot.children);
      const contentCell = contentChildren.length ? contentChildren : contentRoot;
      cells.push([labelCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
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

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About Us page: intro hero, case-study columns, image gallery cards, tabbed testimonials, article cards, FAQ accordion, and closing CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "columns-media",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section .grid-layout.desktop-1-column"]
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
        name: "Case-study intro",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Snapshot image gallery",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"]
      },
      {
        id: "rc4",
        name: "Testimonials tabs",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Latest articles",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"]
      },
      {
        id: "rc6",
        name: "FAQ accordion",
        selector: "#main-content > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Closing CTA banner",
        selector: "#main-content > section.section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-intro": parse6,
    "columns-media": parse4,
    "cards-gallery": parse3,
    "tabs-testimonial": parse7,
    "cards-article": parse2,
    "accordion-faq": parse,
    "hero-banner": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_about_us_default = {
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
  return __toCommonJS(import_about_us_exports);
})();
