'use strict';

window.PocketLunch = (() => {
  const groceries = [
    { id: 'oats', name: 'Rolled Oats', category: 'Grains & Bread', price: 310, pack: 400, unit: 'g', tip: 'Quick oats are easiest to steam. Check cooking time on the pack.' },
    { id: 'buckwheat', name: 'Buckwheat', category: 'Grains & Bread', price: 560, pack: 800, unit: 'g', tip: 'Recipe amount is for dry grain. For checkout, count the whole box.' },
    { id: 'pasta', name: 'Pasta', category: 'Grains & Bread', price: 370, pack: 400, unit: 'g', tip: 'Short pasta shapes mix easily with beans and tomatoes.' },
    { id: 'bread', name: 'Rye Bread', category: 'Grains & Bread', price: 290, pack: 400, unit: 'g', tip: 'Slice and freeze bread portions so you can thaw just what you need.' },
    { id: 'egg', name: 'Eggs', category: 'Protein & Dairy', price: 740, pack: 10, unit: 'pcs', tip: 'For the shopping cart, add a carton; recipes count eggs individually.' },
    { id: 'beans', name: 'Canned Beans', category: 'Protein & Dairy', price: 590, pack: 240, unit: 'g', tip: 'Calculated using drained weight. Check can labels to compare.' },
    { id: 'kefir', name: 'Kefir', category: 'Protein & Dairy', price: 460, pack: 500, unit: 'ml', tip: 'Half goes with bread, the rest is great for breakfast.' },
    { id: 'cheese', name: 'Cheese', category: 'Protein & Dairy', price: 1120, pack: 200, unit: 'g', tip: 'If you already have cheese in the fridge, skip buying a whole pack.' },
    { id: 'apple', name: 'Apple', category: 'Produce', price: 165, pack: 180, unit: 'g', tip: 'One standard apple counts as 180 g. In-store price depends on weight.' },
    { id: 'carrot', name: 'Carrot', category: 'Produce', price: 48, pack: 120, unit: 'g', tip: 'One medium carrot weighs ~120 g. Half can easily go into another meal.' },
    { id: 'tomato', name: 'Canned Tomatoes', category: 'Produce', price: 480, pack: 400, unit: 'g', tip: 'Simmer uncovered to thicken into a rich sauce.' },
    { id: 'potato', name: 'Potato', category: 'Produce', price: 65, pack: 220, unit: 'g', tip: 'One large potato weighs ~220 g.' },
    { id: 'cucumber', name: 'Cucumber', category: 'Produce', price: 180, pack: 180, unit: 'g', tip: 'Slice right before serving to keep bread crispy.' },
    { id: 'tuna', name: 'Canned Tuna', category: 'Protein & Dairy', price: 990, pack: 140, unit: 'g', tip: 'Compare prices by drained fish weight when specified.' },
    { id: 'oil', name: 'Sunflower Oil', category: 'Pantry', price: 690, pack: 500, unit: 'ml', tip: 'A full bottle adds to your first receipt, but lasts through many meals.' }
  ];

  const meals = [
    { id: 'beans-toast', name: 'Bean Toast', gear: 'none', minutes: 8, category: 'On the go', image: 'toast', note: 'Open the can, mash with a fork. Toast the bread if you have a toaster for extra crunch.', ingredients: { bread: 100, beans: 130, cucumber: 75 }, steps: ['Mash beans with a fork and a pinch of salt.', 'Spread onto bread and top with thinly sliced cucumber.'] },
    { id: 'apple-oats', name: 'Apple Oatmeal', gear: 'kettle', minutes: 10, category: 'Morning', image: 'oats', note: 'Dice the apple right into the bowl while the oats steep under a lid.', ingredients: { oats: 65, apple: 150 }, steps: ['Pour boiling water over quick oats following package instructions.', 'While oats steep, dice the apple and mix into the bowl.'] },
    { id: 'buckwheat-egg', name: 'Buckwheat with Egg', gear: 'stove', minutes: 22, category: 'Hearty', image: 'buckwheat', note: 'Fastest option if you already have leftover cooked buckwheat in the fridge.', ingredients: { buckwheat: 85, egg: 2, carrot: 70, oil: 5 }, steps: ['Cook buckwheat according to package directions.', 'Sauté grated carrot and cook eggs until done. Serve with buckwheat.'] },
    { id: 'potato-cheese', name: 'Cheesy Baked Potato', gear: 'microwave', minutes: 14, category: 'Hearty', image: 'potato', note: 'Split the hot potato and let the cheese melt right into the fluffy center.', ingredients: { potato: 300, cheese: 70, cucumber: 80 }, steps: ['Wash potato, prick with a fork, and microwave until tender.', 'Cut open, add cheese, and heat until melted. Serve cucumber on the side.'] },
    { id: 'tomato-pasta', name: 'Tomato Pasta', gear: 'stove', minutes: 19, category: 'Hearty', image: 'pasta', note: 'A splash of pasta water helps emulsify the tomatoes and cheese into a sauce.', ingredients: { pasta: 110, tomato: 155, cheese: 35, oil: 5 }, steps: ['Boil pasta. Reserve a couple spoonfuls of pasta water before draining.', 'Warm tomatoes with oil, toss with pasta, and top with cheese.'] },
    { id: 'kefir-stack', name: 'Kefir & Sandwiches', gear: 'none', minutes: 5, category: 'On the go', image: 'kefir', note: 'When your jacket is already on and class starts in seven minutes.', ingredients: { kefir: 250, bread: 90, cheese: 45, cucumber: 75 }, steps: ['Slice bread, cheese, and cucumber.', 'Assemble sandwiches and pour a glass of kefir.'] },
    { id: 'tuna-toast', name: 'Tuna Rye Toast', gear: 'none', minutes: 7, category: 'On the go', image: 'tuna', note: 'Add the cucumber last — that fresh crunch makes the whole sandwich.', ingredients: { tuna: 95, bread: 100, cucumber: 90 }, steps: ['Drain tuna and flake with a fork.', 'Layer fish onto rye bread and finish with cucumber slices.'] },
    { id: 'beans-bowl', name: 'Warm Tomato Beans', gear: 'microwave', minutes: 9, category: 'Hearty', image: 'beans', note: 'Use crusty bread to mop up the sauce. Less washing up, maximum flavor.', ingredients: { beans: 145, tomato: 115, bread: 90, oil: 5 }, steps: ['Combine beans, canned tomatoes, and oil in a microwave-safe dish.', 'Heat covered, stir well, and serve with bread.'] },
    { id: 'apple-kefir', name: 'Kefir Apple Bowl', gear: 'none', minutes: 6, category: 'Morning', image: 'oats', note: 'Let the oats soak a few minutes ahead of time if you prefer a softer bite.', ingredients: { kefir: 225, apple: 150, oats: 55 }, steps: ['Dice the apple and place in a bowl.', 'Add oats and kefir. Stir and let oats soften.'] }
  ];

  const gear = { none: 'No equipment', kettle: 'Kettle', microwave: 'Microwave', stove: 'Stove' };
  const canCook = {
    any: ['none', 'kettle', 'microwave', 'stove'],
    none: ['none'],
    kettle: ['none', 'kettle'],
    microwave: ['none', 'microwave'],
    stove: ['none', 'kettle', 'stove']
  };
  const byId = Object.fromEntries(groceries.map(item => [item.id, item]));

  function ingredientCost(meal, portions = 1) {
    const cost = Object.entries(meal.ingredients).reduce((total, [id, amount]) => {
      const item = byId[id];
      return total + item.price * amount / item.pack;
    }, 0);
    return Math.round(cost * portions);
  }

  function packagesFor(meal, portions) {
    return Object.entries(meal.ingredients).map(([id, amount]) => {
      const item = byId[id];
      const quantity = Math.ceil(amount * portions / item.pack);
      return { ...item, quantity, cost: quantity * item.price };
    });
  }

  return { groceries, meals, gear, canCook, byId, ingredientCost, packagesFor };
})();
