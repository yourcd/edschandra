/*
 * Article List block
 * -----------------------------------------------------------------------
 * Fetches entries from a helix query-index (e.g. /query-index.json,
 * generated from helix-query.yaml) and renders them as a list of cards.
 *
 * Publishing a new page under the indexed path makes it appear in this
 * list automatically the next time the block runs — no code change
 * needed, because the block always reads the live index at render time.
 *
 * Authoring (optional overrides via a 2-column table under the block):
 *
 *   | Article List |            |
 *   | path          | /en/articles/ |
 *   | limit         | 12             |
 *   | index         | /query-index.json |
 *
 * All override rows are optional. Defaults: index=/query-index.json,
 * no path filter, no limit.
 */

const DEFAULT_SHEET = '/query-index.json';
const PAGE_SIZE = 500; // query-index.json default page size per request

async function fetchIndex(sheetPath) {
  const results = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const url = new URL(sheetPath, window.location.origin);
    url.searchParams.set('offset', offset);
    url.searchParams.set('limit', PAGE_SIZE);

    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(url.href);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();

    results.push(...json.data);
    total = json.total;
    offset += json.limit;
  }

  return results;
}

function filterByPath(entries, pathPrefix) {
  if (!pathPrefix) return entries;
  return entries.filter((entry) => entry.path && entry.path.startsWith(pathPrefix));
}

function sortByDate(entries) {
  return [...entries].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
}

function createCard(entry) {
  const card = document.createElement('li');
  card.className = 'article-list-card';

  const link = document.createElement('a');
  link.href = entry.path;
  card.append(link);

  if (entry.image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'article-list-card-image';
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.title || '';
    img.loading = 'lazy';
    imageWrapper.append(img);
    link.append(imageWrapper);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  if (entry.title) {
    const title = document.createElement('h3');
    title.textContent = entry.title;
    body.append(title);
  }

  if (entry.description) {
    const desc = document.createElement('p');
    desc.textContent = entry.description;
    body.append(desc);
  }

  link.append(body);
  return card;
}

export default async function decorate(block) {
  // Read optional config rows authored below the block table.
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key) config[key] = value;
    }
  });

  const sheetPath = config.index || DEFAULT_SHEET;
  const pathFilter = config.path || '';
  const limit = config.limit ? parseInt(config.limit, 10) : undefined;

  block.textContent = '';
  block.classList.add('article-list');

  const list = document.createElement('ul');
  list.className = 'article-list-items';
  block.append(list);

  try {
    const allEntries = await fetchIndex(sheetPath);
    let entries = filterByPath(allEntries, pathFilter);
    entries = sortByDate(entries);
    if (limit) entries = entries.slice(0, limit);

    if (entries.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'article-list-empty';
      empty.textContent = 'No articles found.';
      block.append(empty);
      return;
    }

    entries.forEach((entry) => list.append(createCard(entry)));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('article-list: failed to load index', err);
    const error = document.createElement('p');
    error.className = 'article-list-error';
    error.textContent = 'Unable to load articles right now.';
    block.append(error);
  }
}
