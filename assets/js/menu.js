'use strict';

(() => {
  const { meals, byId, ingredientCost } = PocketLunch;
  const { currency, element, labelForMeal, plural, motion, bindDisclosure } = LunchUI;
  const list = document.getElementById('menu-results');
  const search = document.getElementById('menu-search');
  const empty = document.getElementById('menu-empty');
  const count = document.getElementById('menu-count');
  const filters = [...document.querySelectorAll('[data-category]')];
  let category = 'all';

  function makeMeal(meal) {
    const card = element('article', 'meal');
    card.id = meal.id;
    const art = element('img', 'meal-art');
    art.src = 'assets/img/' + meal.image + '.svg';
    art.alt = 'Illustration of ' + meal.name;
    art.width = 480;
    art.height = 270;
    art.loading = 'lazy';

    const content = element('div', 'meal-inner');
    const header = element('div', 'meal-title');
    header.append(element('h3', '', meal.name), element('strong', '', currency(ingredientCost(meal))));
    const meta = element('p', 'meal-meta', labelForMeal(meal));
    const note = element('p', 'meal-note', meal.note);

    const button = element('button', 'quiet-button', 'How to cook ');
    button.append(element('span', '', '+'));
    button.lastChild.setAttribute('aria-hidden', 'true');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'recipe-' + meal.id);

    const panel = element('div', 'disclosure');
    panel.id = 'recipe-' + meal.id;
    panel.hidden = true;
    const ingredients = Object.entries(meal.ingredients).map(([id, qty]) => {
      return byId[id].name.toLowerCase() + ' ' + qty + ' ' + byId[id].unit;
    }).join(', ');
    const steps = element('ol');
    for (const step of meal.steps) steps.append(element('li', '', step));
    const plan = element('a', 'text-link', 'Calculate servings ↗');
    plan.href = 'plan.html?meal=' + meal.id;
    panel.append(element('p', '', 'Per serving — ' + ingredients + '.'), steps, plan);
    bindDisclosure(button, panel);
    content.append(header, meta, note, button, panel);
    card.append(art, content);
    return card;
  }

  const cards = meals.map(meal => ({ meal, node: makeMeal(meal) }));
  list.append(...cards.map(card => card.node));

  function applyFilters(animate) {
    const query = search.value.trim().toLowerCase();
    let total = 0;
    for (const { meal, node } of cards) {
      const words = [meal.name, ...Object.keys(meal.ingredients).map(id => byId[id].name)].join(' ').toLowerCase();
      const visible = (category === 'all' || meal.category === category) && words.includes(query);
      node.hidden = !visible;
      if (visible) total++;
    }
    empty.hidden = total !== 0;
    count.textContent = total + ' ' + plural(total, ['meal', 'meals']);
    if (animate && total) $(list).stop(true, true).fadeTo(0, 0.62).fadeTo(motion(155), 1);
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      category = filter.dataset.category;
      for (const chip of filters) chip.setAttribute('aria-pressed', String(chip === filter));
      applyFilters(true);
    });
  }
  search.addEventListener('input', () => applyFilters(true));
  applyFilters(false);

  const requestedRecipe = cards.find(card => '#' + card.meal.id === location.hash);
  if (requestedRecipe) {
    requestedRecipe.node.querySelector('button').click();
    requestedRecipe.node.scrollIntoView({ block: 'start' });
  }
})();
