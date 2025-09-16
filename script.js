// script.js
const nameInput = document.getElementById("name");
const prepInput = document.getElementById("prep");
const cookInput = document.getElementById("cook");
const servingsInput = document.getElementById("servings");
const ingredientsList = document.getElementById("ingredientsList");
const stepsList = document.getElementById("stepsList");
const cardTitle = document.getElementById("cardTitle");
const metaPrep = document.getElementById("metaPrep");
const metaCook = document.getElementById("metaCook");
const metaServ = document.getElementById("metaServ");
const cardIngredients = document.getElementById("cardIngredients");
const cardSteps = document.getElementById("cardSteps");
const card = document.getElementById("card");

function createItem(list, placeholder) {
  const div = document.createElement("div");
  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.oninput = () => {
    update();
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(saveRecipe, 500);
  };
  const btn = document.createElement("button");
  btn.textContent = "✕";
  btn.onclick = () => {
    div.remove();
    update();
  };
  div.append(input, btn);
  list.appendChild(div);
}

function update() {
  cardTitle.textContent = nameInput.value || "Untitled Recipe";
  metaPrep.textContent = "Prep: " + (prepInput.value || "—");
  metaCook.textContent = "Cook: " + (cookInput.value || "—");
  metaServ.textContent = "Serves: " + (servingsInput.value || "—");

  let ing = [...ingredientsList.querySelectorAll("input")]
    .map((i) => i.value)
    .filter(Boolean);
  cardIngredients.innerHTML = ing.length
    ? "<ul>" + ing.map((i) => `<li>${i}</li>`).join("") + "</ul>"
    : "<p>No ingredients yet.</p>";

  let steps = [...stepsList.querySelectorAll("input")]
    .map((i) => i.value)
    .filter(Boolean);
  cardSteps.innerHTML = steps.length
    ? "<ol>" + steps.map((s) => `<li>${s}</li>`).join("") + "</ol>"
    : "<p>No instructions yet.</p>";
}

document.getElementById("addIngredient").onclick = () => {
  createItem(ingredientsList, "Ingredient");
};
document.getElementById("addStep").onclick = () => {
  createItem(stepsList, "Step");
};
document.getElementById("printBtn").onclick = () => print();
document.getElementById("clearBtn").onclick = () => {
  if (confirm('Are you sure you want to clear all fields? This will delete the current recipe.')) {
    [nameInput, prepInput, cookInput, descriptionInput, categoryInput].forEach((i) => (i.value = ""));
    servingsInput.value = 4;
    difficultySelect.value = "";
    ingredientsList.innerHTML = "";
    stepsList.innerHTML = "";
    localStorage.removeItem('currentRecipe');
    update();
  }
};

document.querySelectorAll(".chip").forEach(
  (c) =>
    (c.onclick = () => {
      document
        .querySelectorAll(".chip")
        .forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      card.dataset.theme = c.dataset.theme;
    })
);

function saveRecipe() {
  const recipe = {
    name: nameInput.value,
    description: descriptionInput.value,
    category: categoryInput.value,
    prep: prepInput.value,
    cook: cookInput.value,
    servings: servingsInput.value,
    difficulty: difficultySelect.value,
    ingredients: [...ingredientsList.querySelectorAll("input")].map(i => i.value).filter(Boolean),
    steps: [...stepsList.querySelectorAll("input")].map(i => i.value).filter(Boolean),
    theme: card.dataset.theme
  };
  localStorage.setItem('currentRecipe', JSON.stringify(recipe));
}

function loadRecipe() {
  const saved = localStorage.getItem('currentRecipe');
  if (saved) {
    const recipe = JSON.parse(saved);
    nameInput.value = recipe.name || '';
    descriptionInput.value = recipe.description || '';
    categoryInput.value = recipe.category || '';
    prepInput.value = recipe.prep || '';
    cookInput.value = recipe.cook || '';
    servingsInput.value = recipe.servings || 4;
    difficultySelect.value = recipe.difficulty || '';

    ingredientsList.innerHTML = '';
    (recipe.ingredients || []).forEach(ingredient => {
      createItem(ingredientsList, "Ingredient");
      const inputs = ingredientsList.querySelectorAll("input");
      inputs[inputs.length - 1].value = ingredient;
    });

    stepsList.innerHTML = '';
    (recipe.steps || []).forEach(step => {
      createItem(stepsList, "Step");
      const inputs = stepsList.querySelectorAll("input");
      inputs[inputs.length - 1].value = step;
    });

    if (recipe.theme) {
      document.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.theme === recipe.theme);
      });
      card.dataset.theme = recipe.theme;
    }

    update();
  }
}

[nameInput, prepInput, cookInput, descriptionInput, categoryInput, servingsInput].forEach((i) => {
  i.oninput = () => {
    update();
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(saveRecipe, 1000);
  };
});
difficultySelect.onchange = () => {
  update();
  clearTimeout(window.saveTimeout);
  window.saveTimeout = setTimeout(saveRecipe, 1000);
};

loadRecipe();
update();
