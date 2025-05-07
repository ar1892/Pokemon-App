const output = document.getElementById("output");
const error = document.getElementById("error");
const input = document.getElementById("input-name");
const typeFilter = document.getElementById("type-filter");

let allPokemon = [];

async function fetchAllPokemon() {
  for (let i = 1; i <= 151; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();
    allPokemon.push({
      name: data.name,
      id: data.id,
      img: data.sprites.front_default,
      types: data.types.map(t => t.type.name)
    });
  }
  populateTypeFilter();
  renderCards(allPokemon);
}

function populateTypeFilter() {
  const types = new Set();
  allPokemon.forEach(p => p.types.forEach(t => types.add(t)));
  types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type[0].toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
  });
}

function renderCards(pokemonList) {
  output.innerHTML = "";
  error.textContent = "";

  if (pokemonList.length === 0) {
    error.textContent = "No Pokémon found.";
    return;
  }

  pokemonList.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = pokemon.img;

    const name = document.createElement("h2");
    name.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

    const typeSpan = document.createElement("span");
    typeSpan.className = `type type-${pokemon.types[0]}`;
    typeSpan.textContent = pokemon.types[0];

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(typeSpan);
    output.appendChild(card);
  });
}

function fetchPokemon() {
  const name = input.value.toLowerCase().trim();
  const selectedType = typeFilter.value;

  let filtered = allPokemon;

  if (name) {
    filtered = filtered.filter(p => p.name.includes(name));
  }

  if (selectedType !== "all") {
    filtered = filtered.filter(p => p.types.includes(selectedType));
  }

  renderCards(filtered);
}

function getRandomPokemon() {
  const random = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  renderCards([random]);
}

// Initial load
fetchAllPokemon();