# Today I Have 700 ₸

An educational web zine on student food budgeting in Astana. The four pages use standard semantic HTML5, CSS3, vanilla JavaScript, local Bootstrap 5.3.3, and jQuery 3.7.1.

## Getting Started

Unpack the archive. From the directory containing `index.html`, run a local server:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000/ in your browser (or use VS Code Live Server). A shared HTTP origin is required for `localStorage` to synchronize the shopping cart between pages. No external internet connection is required to run the site.

## Pages and Team Responsibilities

| Page | Key Features | Team Area |
| --- | --- | --- |
| index.html | Category filters, ingredient search, collapsible recipe steps | Alikhan |
| plan.html | 6-field form validation, meal matching, budget remainder & cart package transfer | Alikhan |
| market.html | Live search, category filtering, price sorting & persistent shopping cart | Abay |
| split.html | 5-field form validation, exact integer bill splitting with reserve buffer & print view | Abay |

*Note: In the final project report, record each member's verified individual contributions and commits.*

## Live Demonstration Flow

1. **Zine (`index.html`)** &rarr; Select "Bean Toast" &rarr; Click "How to cook +" &rarr; Click "Calculate servings ↗". With a 700 ₸ budget, ingredient cost is 467 ₸, leaving 233 ₸.
2. **My Lunch (`plan.html`)** &rarr; Set 700 ₸ budget, 20 minutes, 1 serving, kettle, today's date, and "Full retail packages at checkout". Apple Oatmeal costs 475 ₸ in retail packs. Click "Add packages to cart".
3. **Groceries (`market.html`)** &rarr; Add a carton of eggs for 740 ₸. The cart total becomes 1,215 ₸. Navigate to "Shared Bill".
4. **Shared Bill (`split.html`)** &rarr; Enter 2 people, 700 ₸ per person, 0% reserve, and today's date. The 1,215 ₸ total splits into shares of 608 ₸ and 607 ₸ (exact tenge integer division).
5. **Form Validation Checks** &rarr; Submit an empty form. Notice red invalid highlights and clear inline messages beneath each field. Correct the fields one by one to see error messages disappear. On valid submission, a success banner appears and the form resets.
6. **Interaction & Accessibility** &rarr; On "Groceries", test zero-match search results ("Nothing found"), sorting (Low to High / High to Low), and rapid clicks on "Note +". Check Tab key keyboard focus and responsive layout at 375px, 768px, and 1280px in Chrome DevTools.

## Calculation Logic

- **Pantry / Per-Serving Model (`assets/js/data.js`):** 9 meals and 15 grocery products. The portion cost divides package price by package size and multiplies by grams/units used, rounding only at the end.
- **Checkout / Retail Pack Model:** The required quantity rounds up to the nearest whole package for each ingredient. The "Add packages" button takes the maximum of required vs. existing cart quantity so repeated clicks do not unintentionally duplicate items.
- **Shared Bill Split:** Cart data persists across pages via browser storage. The total plus reserve buffer is divided using integer math; any odd remainder distributes +1 ₸ across the first participants.
- **Animation Queue Safety:** jQuery effects (`fadeIn`, `fadeTo`, `slideDown`, `animate`) always call `.stop(true, true)` or `.stop(true, false)` to prevent queue pile-up during rapid repeated user clicks. `prefers-reduced-motion` is respected.

See `CREDITS.md` for licenses and attributions.
# WEB_Frontend_Endterm
