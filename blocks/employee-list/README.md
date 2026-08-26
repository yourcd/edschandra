# Employee List block

## 1. Author the data (document authoring)

Create a sheet document named `employees` (DA.live / Google Sheet / Excel) at
the site root with exactly these column headers:

| Name | Department | Experience | City |
|------|------------|------------|------|

Add one row per employee. Preview, then Publish. It becomes available at:

    https://<your-site>/employees.json

The Helix JSON endpoint for sheets supports pagination out of the box:

    /employees.json?limit=10&offset=0
    /employees.json?limit=10&offset=10

Response shape:

```json
{
  "total": 42,
  "offset": 0,
  "limit": 10,
  "data": [
    { "Name": "Jane Doe", "Department": "Engineering", "Experience": "5", "City": "Austin" }
  ]
}
```

Because the block calls this endpoint on every "Load more" click (and on
initial load), any re-publish of the `employees` sheet is picked up on next
page view/click — no rebuild needed.

## 2. Author the placeholders

Create a sheet document named `placeholders` at the site root:

| Key       | Value      |
|-----------|------------|
| Load More | Load more  |

Publish it → available at `/placeholders.json`. Helix converts `Load More`
into the camelCase key `loadMore` when read through `fetchPlaceholders()`.

If your project supports multiple locales, place the sheet under each
locale root (e.g. `/fr/placeholders`) — `fetchPlaceholders(prefix)` already
handles the locale prefix in the standard boilerplate.

## 3. Author the block on a page

In a page document, insert a table:

| Employee List |
| :---- |
| /employees.json |

- First row = block name.
- Second row (optional) = override JSON source path for this page. If
  omitted, the block defaults to `/employees.json`.

## 4. Code

Drop `employee-list.js` and `employee-list.css` into `blocks/employee-list/`
in your EDS repo. No other wiring is needed — `scripts/aem.js` already
auto-loads matching `.js`/`.css` for any block name found in the page.

### If your project's `scripts/aem.js` doesn't yet export `fetchPlaceholders`

Most current boilerplates already include it. If yours doesn't, add this to
`scripts/aem.js` (or `scripts/scripts.js`) and import it from there instead:

```js
function toCamelCase(str) {
  return str.toLowerCase().replace(/[^0-9a-z]+([0-9a-z])/g, (_, c) => c.toUpperCase());
}

export async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  if (!window.placeholders[prefix]) {
    const path = prefix === 'default' ? '/placeholders.json' : `${prefix}/placeholders.json`;
    try {
      const resp = await fetch(path);
      const json = await resp.json();
      const placeholders = {};
      json.data.forEach((row) => {
        placeholders[toCamelCase(row.Key)] = row.Value;
      });
      window.placeholders[prefix] = placeholders;
    } catch (e) {
      window.placeholders[prefix] = {};
    }
  }
  return window.placeholders[prefix];
}
```

## 5. Verify

- Load the page: 10 rows render immediately, "Load more" shows the label
  from `/placeholders.json`.
- Click "Load more": next 10 rows append; button disappears once all rows
  (`total`) are loaded.
- Edit the `employees` sheet, republish, reload the page: new/changed rows
  appear on next fetch.
