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
  input.oninput = update;
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
  [nameInput, prepInput, cookInput].forEach((i) => (i.value = ""));
  servingsInput.value = 1;
  ingredientsList.innerHTML = "";
  stepsList.innerHTML = "";
  update();
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

update();
