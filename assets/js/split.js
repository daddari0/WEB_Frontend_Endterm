'use strict';

(() => {
  const { readBasket, basketTotal, currency, integerIn, futureDate, dateTextField,
    displayDate, element, bindForm, showNotice, motion, drawMeter, plural } = LunchUI;
  const form = document.getElementById('split-form');
  const basketLabel = document.getElementById('split-basket-label');
  const initial = document.getElementById('split-initial');
  const result = document.getElementById('split-result');
  const notice = document.getElementById('split-notice');
  dateTextField(document.getElementById('dinner-date'));

  function refreshBasket() {
    const basket = readBasket();
    const quantity = Object.values(basket).reduce((sum, qty) => sum + qty, 0);
    basketLabel.textContent = quantity
      ? quantity + ' ' + plural(quantity, ['pack', 'packs']) + ' · ' + currency(basketTotal(basket))
      : 'Cart is currently empty.';
    return basket;
  }

  function splitReceipt(fields) {
    const basket = refreshBasket();
    if (!Object.keys(basket).length) {
      notice.dataset.kind = 'error';
      showNotice(notice, 'Add at least one item on the Groceries page first. Your form entries are saved.');
      return false;
    }

    const base = basketTotal(basket);
    const people = Number(fields.people);
    const buffer = Math.ceil(base * Number(fields.reserve) / 100);
    const total = base + buffer;
    const groupBudget = Number(fields.limit) * people;
    const left = groupBudget - total;
    const baseShare = Math.floor(total / people);
    const extra = total % people;

    initial.hidden = true;
    result.replaceChildren(element('h3', '', fields.meeting.trim()));
    result.append(element('p', 'result-meta', displayDate(fields['dinner-date']) + ' · ' + people + ' ' + plural(people, ['person', 'people'])));
    result.append(element('p', '', 'Groceries ' + currency(base) + ' · buffer ' + currency(buffer)));
    const totalLine = element('div', 'receipt-total');
    totalLine.append(element('span', '', 'Total'), element('strong', '', currency(total)));
    result.append(totalLine);
    result.append(element('p', '', left < 0 ? 'Over group budget by ' + currency(-left) : 'Remaining in group budget: ' + currency(left)));

    const meter = element('div', left < 0 ? 'meter over' : 'meter');
    meter.setAttribute('aria-hidden', 'true');
    const fill = element('span');
    meter.append(fill);
    result.append(meter);

    const shares = element('ol', 'list-unstyled');
    for (let index = 0; index < people; index++) {
      const line = element('li', 'cart-line');
      line.append(element('span', '', 'Person ' + (index + 1)), element('strong', '', currency(baseShare + (index < extra ? 1 : 0))));
      shares.append(line);
    }
    result.append(shares);
    const print = element('button', 'quiet-button', 'Print or save as PDF ↗');
    print.type = 'button';
    print.addEventListener('click', () => window.print());
    result.append(print);

    $(result).stop(true, true).hide().removeAttr('hidden').fadeIn(motion(170));
    drawMeter(fill, total * 100 / groupBudget);
    notice.dataset.kind = 'success';
    showNotice(notice, 'Done. Shares calculated and form reset.');
  }

  bindForm(form, {
    meeting: value => value.length >= 3 && value.length <= 40 ? '' : 'Must be between 3 and 40 characters.',
    people: value => integerIn(value, 2, 12) ? '' : 'Enter a whole number between 2 and 12.',
    limit: value => integerIn(value, 100, 10000) ? '' : 'Enter from 100 to 10,000 ₸ per person.',
    reserve: value => integerIn(value, 0, 30) ? '' : 'Buffer can be between 0% and 30%.',
    'dinner-date': value => futureDate(value) ? '' : 'Choose today or a future date.'
  }, splitReceipt);

  refreshBasket();
  window.addEventListener('pageshow', refreshBasket);
})();
