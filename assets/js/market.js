'use strict';

(() => {
  const { groceries, byId } = PocketLunch;
  const { readBasket, saveBasket, basketTotal, currency, motion, element, bindDisclosure, showNotice, plural } = LunchUI;
  let basket = readBasket();
  const search = document.getElementById('market-search');
  const category = document.getElementById('market-category');
  const sort = document.getElementById('market-sort');
  const results = document.getElementById('market-results');
  const count = document.getElementById('market-count');
  const empty = document.getElementById('market-empty');
  const lines = document.getElementById('cart-items');
  const sum = document.getElementById('cart-total');
  const clear = document.getElementById('clear-cart');
  const notice = document.getElementById('cart-notice');

  for (const name of new Set(groceries.map(item => item.category))) {
    const option = element('option', '', name);
    option.value = name;
    category.append(option);
  }

  function commit(text) {
    const stored = saveBasket(basket);
    showNotice(notice, stored ? text : text + ' Browser failed to save cart for the next page.');
    renderBasket();
  }

  function changeQuantity(id, step) {
    const quantity = (basket[id] || 0) + step;
    if (quantity > 20) {
      showNotice(notice, 'You can add up to 20 packs of a single item in this cart.');
      return;
    }
    if (quantity <= 0) delete basket[id];
    else basket[id] = quantity;
    commit(quantity > 0 ? byId[id].name + ' · in cart: ' + quantity + '.' : byId[id].name + ' removed from cart.');
  }

  function makeProduct(item) {
    const row = element('article', 'product');
    const main = element('div', 'product-main');
    const name = element('div');
    name.append(element('h3', '', item.name), element('p', '', item.pack + ' ' + item.unit + ' · ' + item.category));
    const actions = element('div', 'product-actions');
    const add = element('button', 'add-button', '+');
    add.type = 'button';
    add.setAttribute('aria-label', 'Add ' + item.name);
    add.addEventListener('click', () => changeQuantity(item.id, 1));
    actions.append(element('strong', 'product-price', currency(item.price)), add);
    main.append(name, actions);
    const details = element('button', 'quiet-button', 'Note ');
    details.type = 'button';
    details.append(element('span', '', '+'));
    details.lastChild.setAttribute('aria-hidden', 'true');
    details.setAttribute('aria-expanded', 'false');
    details.setAttribute('aria-controls', 'tip-' + item.id);
    const panel = element('p', 'disclosure', item.tip);
    panel.id = 'tip-' + item.id;
    panel.hidden = true;
    bindDisclosure(details, panel);
    row.append(main, details, panel);
    return row;
  }

  const rows = new Map(groceries.map(item => [item.id, makeProduct(item)]));

  function renderProducts(animate) {
    const query = search.value.trim().toLowerCase();
    const visible = groceries.filter(item => (!category.value || category.value === item.category)
      && item.name.toLowerCase().includes(query));
    if (sort.value !== 'default') {
      const direction = sort.value === 'low' ? 1 : -1;
      visible.sort((a, b) => direction * (a.price - b.price));
    }
    results.replaceChildren(...visible.map(item => rows.get(item.id)));
    empty.hidden = visible.length > 0;
    count.textContent = visible.length + ' ' + plural(visible.length, ['item', 'items']);
    if (animate && visible.length) $(results).stop(true, true).fadeTo(0, 0.65).fadeTo(motion(150), 1);
  }

  function makeQtyButton(id, step) {
    const button = element('button', 'qty-button', step > 0 ? '+' : '−');
    button.type = 'button';
    button.dataset.product = id;
    button.dataset.step = step;
    button.setAttribute('aria-label', (step > 0 ? 'Increase quantity — ' : 'Decrease quantity — ') + byId[id].name);
    button.addEventListener('click', () => changeQuantity(id, step));
    return button;
  }

  function renderBasket() {
    const previous = document.activeElement;
    const focused = previous.dataset?.product;
    const step = previous.dataset?.step;
    lines.replaceChildren();
    const entries = Object.entries(basket);
    if (!entries.length) lines.append(element('p', 'empty', 'Cart is empty. Click "+" next to any grocery item on the shelf.'));
    for (const [id, qty] of entries) {
      const row = element('div', 'cart-line');
      const controls = element('div', 'qty');
      controls.append(makeQtyButton(id, -1), element('span', '', qty), makeQtyButton(id, 1));
      row.append(element('span', '', byId[id].name), controls);
      lines.append(row);
    }
    sum.textContent = currency(basketTotal(basket));
    clear.disabled = !entries.length;
    if (focused) {
      const replacement = lines.querySelector('[data-product="' + focused + '"][data-step="' + step + '"]');
      (replacement || rows.get(focused).querySelector('.add-button')).focus();
    }
  }

  clear.addEventListener('click', () => {
    basket = {};
    commit('Cart cleared.');
    search.focus();
  });
  search.addEventListener('input', () => renderProducts(true));
  category.addEventListener('change', () => renderProducts(true));
  sort.addEventListener('change', () => renderProducts(true));
  window.addEventListener('pageshow', () => {
    basket = readBasket();
    renderBasket();
  });
  renderProducts(false);
  renderBasket();
})();
