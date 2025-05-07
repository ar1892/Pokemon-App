const output = document.getElementById("output");
const typeFilter = document.getElementById("type-filter");
const errorDisplay = document.getElementById("error");
let allPokemonData = [];

async function fetchAllPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await res.json();
    const promises = data.results.map(p =>
      fetch(p.url).then(r => r.json())
    );
    allPokemonData = await Promise.all(promises);
    renderAllPokemon(allPokemonData);
    populateTypeFilter(allPokemonData);
  } catch (err) {
    errorDisplay.textContent = "Error loading Pokémon data.";
  }
}

function renderAllPokemon(pokemonList) {
  output.innerHTML = "";
  pokemonList.forEach(p => renderCard(p));
}

function renderCard(pokemon) {
  const typeNames = pokemon.types.map(t => t.type.name);
  const primaryType = typeNames[0];

  const card = document.createElement("div");
  card.className = `card ${primaryType}`;

  const statHTML = pokemon.stats.map(stat => {
    const label = stat.stat.name.replace("-", " ");
    return `<p><strong>${label}:</strong> ${stat.base_stat}</p>`;
  }).join("");

  card.innerHTML = `
    <div class="image-wrapper">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
    </div>
    <h2>${capitalize(pokemon.name)}</h2>
    <div class="types">
      ${typeNames.map(type => `<span class="type type-${type}">${capitalize(type)}</span>`).join("")}
    </div>
    <div class="stats">${statHTML}</div>
  `;

  output.appendChild(card);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function searchPokemon() {
  const name = document.getElementById("input-name").value.toLowerCase().trim();
  const type = typeFilter.value;

  const filtered = allPokemonData.filter(p =>
    (!name || p.name.includes(name)) &&
    (type === "all" || p.types.some(t => t.type.name === type))
  );

  output.innerHTML = "";

  if (filtered.length === 0) {
    errorDisplay.textContent = "No Pokémon found.";
  } else {
    errorDisplay.textContent = "";
    filtered.forEach(p => renderCard(p));
  }
}

function getRandomPokemon() {
  const random = allPokemonData[Math.floor(Math.random() * allPokemonData.length)];
  output.innerHTML = "";
  renderCard(random);
}

function resetDisplay() {
  document.getElementById("input-name").value = "";
  typeFilter.value = "all";
  errorDisplay.textContent = "";
  renderAllPokemon(allPokemonData);
}

function populateTypeFilter(data) {
  const types = new Set();
  data.forEach(p => p.types.forEach(t => types.add(t.type.name)));

  [...types].sort().forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = capitalize(type);
    typeFilter.appendChild(option);
  });
}

fetchAllPokemon();