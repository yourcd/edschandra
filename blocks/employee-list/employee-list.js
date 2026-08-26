const PAGE_SIZE = 10;
const DEFAULT_SOURCE = '/employees.json';
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^0-9a-z]+([0-9a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Self-contained placeholder fetcher. Does not depend on scripts/aem.js
 * exporting fetchPlaceholders (some boilerplate versions don't).
 * Caches the result on window so repeated calls across blocks don't
 * re-fetch. Reads /placeholders.json, or /<prefix>/placeholders.json
 * when a locale prefix is supplied.
 * @param {string} prefix
 */
async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  if (!window.placeholders[prefix]) {
    const path = prefix === 'default' ? '/placeholders.json' : `${prefix}/placeholders.json`;
    try {
      const resp = await fetch(path);
      const json = await resp.json();
      const placeholders = {};
      (json.data || []).forEach((row) => {
        if (row.Key) placeholders[toCamelCase(row.Key)] = row.Value;
      });
      window.placeholders[prefix] = placeholders;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Employee List: failed to fetch placeholders', e);
      window.placeholders[prefix] = {};
    }
  }
  return window.placeholders[prefix];
}

function renderRow(employee, isHeader = false) {
  const row = document.createElement('div');
  row.className = 'employee-list-row';
  if (isHeader) row.classList.add('employee-list-header');

  COLUMNS.forEach((col) => {
    const cell = document.createElement('div');
    cell.className = 'employee-list-cell';
    cell.dataset.label = col;
    cell.textContent = isHeader ? col : (employee[col] ?? '');
    row.append(cell);
  });

  return row;
}

/**
 * Decorates the Employee List block.
 * Renders 10 employees at a time from a published sheet JSON endpoint,
 * with a "Load more" button (label sourced from /placeholders.json)
 * that appends the next 10 rows on each click.
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  // Optional authored row lets a page point the block at a different JSON source.
  const configRow = block.querySelector(':scope > div');
  const authoredPath = configRow?.textContent?.trim();
  const source = authoredPath && authoredPath.startsWith('/') ? authoredPath : DEFAULT_SOURCE;

  block.textContent = '';

  const table = document.createElement('div');
  table.className = 'employee-list-table';
  table.append(renderRow(null, true));

  const loadMoreWrapper = document.createElement('div');
  loadMoreWrapper.className = 'employee-list-load-more-wrapper';
  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.type = 'button';
  loadMoreBtn.className = 'employee-list-load-more';
  loadMoreWrapper.append(loadMoreBtn);

  block.append(table, loadMoreWrapper);

  // Label comes from the placeholders sheet (Key: "Load More" -> loadMore).
  let placeholders = {};
  try {
    placeholders = await fetchPlaceholders();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Employee List: could not load placeholders, using default label', e);
  }
  loadMoreBtn.textContent = placeholders.loadMore || 'Load more';

  let offset = 0;
  let total = Infinity;

  async function loadPage() {
    loadMoreBtn.disabled = true;
    loadMoreBtn.setAttribute('aria-busy', 'true');

    try {
      const resp = await fetch(`${source}?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!resp.ok) throw new Error(`Failed to load ${source}: ${resp.status}`);
      const json = await resp.json();
      const rows = json.data || [];
      total = typeof json.total === 'number' ? json.total : offset + rows.length;

      rows.forEach((employee) => table.append(renderRow(employee)));
      offset += rows.length;

      if (rows.length === 0 || offset >= total) {
        loadMoreBtn.remove();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Employee List: unable to load employees', e);
      loadMoreBtn.remove();
    } finally {
      if (loadMoreBtn.isConnected) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.removeAttribute('aria-busy');
      }
    }
  }

  loadMoreBtn.addEventListener('click', loadPage);

  // Load the first page of 10 on decoration.
  await loadPage();
}