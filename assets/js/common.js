'use strict';

window.LunchUI = (() => {
  const amounts = new Intl.NumberFormat('en-US');
  const currency = value => amounts.format(value) + '\u00a0₸';
  const plural = (n, words) => (n === 1 ? words[0] : (words[1] || words[0] + 's'));
  const motion = ms => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms;
  const basketKey = 'lunch700-basket-v1';

  function readBasket() {
    let raw;
    try {
      raw = JSON.parse(localStorage.getItem(basketKey) || '{}');
    } catch {
      return {};
    }
    return Object.fromEntries(PocketLunch.groceries
      .filter(item => Number.isInteger(raw?.[item.id]) && raw[item.id] > 0 && raw[item.id] <= 20)
      .map(item => [item.id, raw[item.id]]));
  }

  function saveBasket(basket) {
    try {
      localStorage.setItem(basketKey, JSON.stringify(basket));
      return true;
    } catch {
      return false;
    }
  }

  function basketTotal(basket) {
    return Object.entries(basket).reduce((sum, [id, qty]) => sum + PocketLunch.byId[id].price * qty, 0);
  }

  function localDate(date = new Date()) {
    const fields = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    return fields.map(value => String(value).padStart(2, '0')).join('-');
  }

  function displayDate(value) {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(value + 'T12:00:00'));
  }

  function futureDate(value) {
    return value >= localDate();
  }

  function integerIn(value, min, max) {
    return /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function labelForMeal(meal) {
    return meal.minutes + ' min · ' + PocketLunch.gear[meal.gear];
  }

  function bindForm(form, rules, onSuccess) {
    let checked = false;

    function validate(name, rule) {
      const field = form.elements[name];
      const value = field.value.trim();
      const error = value === '' ? 'Please fill in this field.' : rule(value);
      field.classList.toggle('is-invalid', Boolean(error));
      field.setAttribute('aria-invalid', String(Boolean(error)));
      document.getElementById(field.id + '-error').textContent = error || '';
      return !error;
    }

    function resetErrors() {
      for (const name of Object.keys(rules)) {
        const field = form.elements[name];
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        document.getElementById(field.id + '-error').textContent = '';
      }
      checked = false;
    }

    form.addEventListener('input', event => {
      const name = event.target.name;
      if (checked && Object.hasOwn(rules, name)) validate(name, rules[name]);
    });
    form.addEventListener('change', event => {
      const name = event.target.name;
      if (checked && Object.hasOwn(rules, name)) validate(name, rules[name]);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      checked = true;
      const invalid = Object.entries(rules).filter(([name, rule]) => !validate(name, rule));
      if (invalid.length) {
        form.elements[invalid[0][0]].focus();
        return;
      }
      const submitted = Object.fromEntries(new FormData(form));
      if (onSuccess(submitted) !== false) {
        form.reset();
        resetErrors();
      }
    });
  }

  function showNotice(node, text) {
    node.textContent = text;
    $(node).stop(true, true).hide().removeAttr('hidden').fadeIn(motion(180));
  }

  function bindDisclosure(button, panel) {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      const $panel = $(panel).stop(true, true);
      if (open) $panel.hide().removeAttr('hidden').slideDown(motion(170));
      else $panel.slideUp(motion(170), () => { panel.hidden = true; });
    });
  }

  function drawMeter(node, value) {
    $(node).stop(true, false).animate({ width: Math.min(100, Math.max(0, value)) + '%' }, motion(260));
  }

  function dateTextField(node) {
    node.min = localDate();
  }

  document.querySelectorAll('[data-disclosure]').forEach(button => {
    bindDisclosure(button, document.getElementById(button.getAttribute('aria-controls')));
  });

  return { currency, plural, motion, readBasket, saveBasket, basketTotal, localDate, displayDate,
    futureDate, integerIn, element, labelForMeal, bindForm, showNotice, bindDisclosure, drawMeter, dateTextField };
})();
