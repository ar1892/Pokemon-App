const output = document.getElementById("output");
const typeSelect = document.getElementById("type-select");
const input = document.getElementById("input-name");
const error = document.getElementById("error");

const typeColors = {
  grass: "#8bc34a",
  fire: "#ff7043",
  water: "#42a5f5",
  bug: "#9ccc65",
  normal: "#bdbdbd",
  poison: "#ab47bc",
  electric: "#ffeb3b",
  ground: "#a1887f",
  fairy: "#f48fb1",
  fighting: "#f44336",
  psychic: "#ce93d8",
  rock: "#a1887f",
  ghost: "#7e57c2",
  ice: "#81d4fa",
  dragon: "#9575cd"
};

let allPokemon = [];

async function loadPokemon() {
  const limit = 151;
  for (let i = 1; i <= limit; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();
    allPokemon.push(data);
  }
  render(allPokemon);
  populateTypeDropdown(allPokemon);
}

function render(pokemonList) {
  output.innerHTML = "";
  pokemonList.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const mainType = p.types[0].type.name;
    card.style.backgroundColor = typeColors[mainType] || "#ccc";

    card.innerHTML = `
      <div class="sprite">
        <img src="${p.sprites.front_default}" alt="${p.name}" />
      </div>
      <h2>${capitalize(p.name)}</h2>
      <div class="types">
        ${p.types.map(t => `<span class="type">${capitalize(t.type.name)}</span>`).join("")}
      </div>
      <div class="stats">
        ${p.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("")}
      </div>
    `;
    output.appendChild(card);
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function searchPokemon() {
  const term = input.value.toLowerCase();
  const selectedType = typeSelect.value;
  let results = allPokemon.filter(p => p.name.includes(term));
  if (selectedType !== "all") {
    results = results.filter(p => p.types.some(t => t.type.name === selectedType));
  }
  if (results.length === 0) {
    error.textContent = "No Pokémon found.";
    output.innerHTML = "";
  } else {
    error.textContent = "";
    render(results);
  }
}

function resetPage() {
  input.value = "";
  typeSelect.value = "all";
  error.textContent = "";
  render(allPokemon);
}

function getRandomPokemon() {
  const random = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  render([random]);
}

function populateTypeDropdown(pokemonList) {
  const types = new Set();
  pokemonList.forEach(p => p.types.forEach(t => types.add(t.type.name)));
  [...types].sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = capitalize(t);
    typeSelect.appendChild(opt);
  });
}

loadPokemon();

