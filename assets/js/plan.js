'use strict';

(() => {
  const { meals, canCook, ingredientCost, packagesFor } = PocketLunch;
  const { currency, integerIn, futureDate, dateTextField, displayDate, localDate, element,
    labelForMeal, plural, bindForm, showNotice, motion, drawMeter, readBasket, saveBasket } = LunchUI;
  const form = document.getElementById('plan-form');
  const initial = document.getElementById('plan-initial');
  const result = document.getElementById('plan-result');
  const notice = document.getElementById('plan-notice');
  const requested = meals.find(meal => meal.id === new URLSearchParams(location.search).get('meal'));
  const date = document.getElementById('lunch-date');
  dateTextField(date);

  if (requested) {
    form.elements.budget.value = 700;
    form.elements.minutes.value = Math.max(requested.minutes, 20);
    form.elements.portions.value = 1;
    form.elements.gear.value = requested.gear;
    form.elements.mode.value = 'portion';
    date.value = localDate();
    showNotice(notice, 'Opened from menu — "' + requested.name + '". Check your criteria and click "Find meals".');
  }

  function addPackages(lines, button) {
    const basket = readBasket();
    for (const line of lines) basket[line.id] = Math.max(line.quantity, basket[line.id] || 0);
    if (saveBasket(basket)) {
      button.textContent = 'Packs in cart ✓';
      showNotice(notice, 'Packs added to Groceries. Existing quantities were updated.');
    } else {
      showNotice(notice, 'Browser failed to save cart. You can see the list of packs in the estimate below.');
    }
  }

  function showPlan(fields) {
    const budget = Number(fields.budget);
    const minutes = Number(fields.minutes);
    const portions = Number(fields.portions);
    const checkout = fields.mode === 'checkout';
    const choices = meals.filter(meal => meal.minutes <= minutes && canCook[fields.gear].includes(meal.gear))
      .map(meal => {
        const packages = packagesFor(meal, portions);
        const cost = checkout ? packages.reduce((sum, item) => sum + item.cost, 0) : ingredientCost(meal, portions);
        return { meal, cost, packages };
      })
      .sort((a, b) => Number(b.meal === requested) - Number(a.meal === requested) || a.cost - b.cost);

    initial.hidden = true;
    result.replaceChildren();
    const metadata = displayDate(fields['lunch-date']) + ' · ' + portions + ' ' + plural(portions, ['serving', 'servings'])
      + ' · budget ' + currency(budget) + (checkout ? ' · whole packages' : ' · ingredient cost');
    result.append(element('p', 'result-meta', metadata));

    const matches = choices.filter(choice => choice.cost <= budget);
    if (!matches.length) {
      const cheapest = choices.length ? Math.min(...choices.map(choice => choice.cost)) : null;
      const help = cheapest === null ? 'No meals match your time and equipment. Give yourself more time or change equipment.'
        : 'The cheapest option for these criteria costs ' + currency(cheapest) + '. Try reducing servings or increasing your budget.';
      result.append(element('p', 'empty', help));
    }
    for (const { meal, cost, packages } of matches) {
      const line = element('article', 'result-line');
      const heading = element('div', 'recipe-heading');
      const recipe = element('a', '', meal.name);
      recipe.href = 'index.html#' + meal.id;
      const title = element('h3');
      title.append(recipe);
      heading.append(title, element('strong', '', currency(cost)));
      const meter = element('div', 'meter');
      meter.setAttribute('aria-hidden', 'true');
      const fill = element('span');
      meter.append(fill);
      line.append(heading, element('p', '', labelForMeal(meal) + ' · remaining ' + currency(budget - cost)), meter);
      if (checkout) {
        line.append(element('p', '', packages.map(item => item.name + ' × ' + item.quantity).join(' · ')));
        const action = element('button', 'quiet-button', 'Add packages to cart');
        action.type = 'button';
        action.addEventListener('click', () => addPackages(packages, action));
        line.append(action);
      }
      result.append(line);
    }
    $(result).stop(true, true).hide().removeAttr('hidden').fadeIn(motion(170));
    result.querySelectorAll('.meter > span').forEach((fill, i) => drawMeter(fill, matches[i].cost * 100 / budget));
    showNotice(notice, matches.length ? 'Done. Matching options — ' + matches.length + '.' : 'Criteria checked. No matching meals found.');
  }

  bindForm(form, {
    budget: value => integerIn(value, 200, 10000) ? '' : 'Enter a whole amount between 200 and 10,000 ₸.',
    minutes: value => integerIn(value, 5, 90) ? '' : 'Enter a whole number between 5 and 90.',
    portions: value => integerIn(value, 1, 6) ? '' : 'From 1 to 6 servings.',
    gear: value => Object.hasOwn(canCook, value) ? '' : 'Choose equipment from the list.',
    'lunch-date': value => futureDate(value) ? '' : 'Choose today or a future date.',
    mode: value => ['portion', 'checkout'].includes(value) ? '' : 'Choose a calculation mode.'
  }, showPlan);
})();
