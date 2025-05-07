const output = document.getElementById("output");
const searchInput = document.getElementById("input-name");
const typeFilter = document.getElementById("type-filter");
const error = document.getElementById("error");

let allPokemon = [];

async function fetchAllPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await res.json();
    const results = data.results;

    const detailedData = await Promise.all(results.map(p => fetch(p.url).then(res => res.json())));
    allPokemon = detailedData;
    renderPokemon(allPokemon);
    populateTypeFilter();
  } catch (err) {
    console.error("Failed to fetch Pokémon:", err);
    error.textContent = "Error loading Pokémon data.";
  }
}

function renderPokemon(pokemonList) {
  error.textContent = "";
  output.innerHTML = "";
  if (pokemonList.length === 0) {
    error.textContent = "No Pokémon found.";
    return;
  }

  pokemonList.forEach(poke => {
    const card = document.createElement("div");
    const primaryType = poke.types[0].type.name;
    card.className = `card ${primaryType}`;

    const img = document.createElement("img");
    img.src = poke.sprites.front_default;

    const name = document.createElement("h2");
    name.textContent = poke.name;

    const typeDiv = document.createElement("div");
    typeDiv.className = "types";
    poke.types.forEach(t => {
      const span = document.createElement("span");
      span.className = `type ${t.type.name}`;
      span.textContent = t.type.name;
      typeDiv.appendChild(span);
    });

    const statsDiv = document.createElement("div");
    statsDiv.className = "stats";
    poke.stats.forEach(s => {
      const p = document.createElement("p");
      p.textContent = `${s.stat.name}: ${s.base_stat}`;
      statsDiv.appendChild(p);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(typeDiv);
    card.appendChild(statsDiv);
    output.appendChild(card);
  });
}

function filterPokemon() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value;
  const filtered = allPokemon.filter(poke => {
    const matchesName = poke.name.includes(searchTerm);
    const matchesType = selectedType === "all" || poke.types.some(t => t.type.name === selectedType);
    return matchesName && matchesType;
  });
  renderPokemon(filtered);
}

function getRandomPokemon() {
  const random = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  renderPokemon([random]);
}

function populateTypeFilter() {
  const types = new Set();
  allPokemon.forEach(poke => {
    poke.types.forEach(t => types.add(t.type.name));
  });
  [...types].sort().forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", fetchAllPokemon);
