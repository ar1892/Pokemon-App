const output = document.getElementById("output");
const inputName = document.getElementById("input-name");
const typeFilter = document.getElementById("type-filter");
const error = document.getElementById("error");

const typeColors = {
  grass: "grass", fire: "fire", water: "water", electric: "electric",
  bug: "bug", normal: "normal", poison: "poison", ground: "ground",
  fairy: "fairy", fighting: "fighting", psychic: "psychic", rock: "rock",
  ghost: "ghost", ice: "ice", dragon: "dragon", steel: "steel", flying: "flying"
};

async function fetchPokemonList(count = 151) {
  const promises = [];
  for (let i = 1; i <= count; i++) {
    promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
  }
  const data = await Promise.all(promises);
  renderAll(data);
  populateTypes(data);
}

function renderAll(pokemonList) {
  output.innerHTML = "";
  pokemonList.forEach(p => createCard(p));
}

function createCard(pokemon) {
  const card = document.createElement("div");
  const types = pokemon.types.map(t => t.type.name);
  const mainType = types[0];
  card.className = `card ${mainType}`;

  card.innerHTML = `
    <div class="img-circle">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
    <h2>${capitalize(pokemon.name)}</h2>
    <div class="types">${types.map(t => `<span class="type-badge ${t}">${capitalize(t)}</span>`).join("")}</div>
    <div class="stats">
      ${pokemon.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("")}
    </div>
  `;

  output.appendChild(card);
}

function searchPokemon() {
  const name = inputName.value.toLowerCase().trim();
  const type = typeFilter.value;

  if (!name && type === "all") return;

  output.innerHTML = "";
  error.textContent = "";

  fetchPokemonList().then(() => {
    const cards = [...document.querySelectorAll(".card")];
    const matched = cards.filter(card =>
      (!name || card.querySelector("h2").textContent.toLowerCase().includes(name)) &&
      (type === "all" || card.classList.contains(type))
    );
    if (matched.length === 0) {
      error.textContent = "No matching Pokémon found.";
    } else {
      output.innerHTML = "";
      matched.forEach(card => output.appendChild(card));
    }
  });
}

function getRandomPokemon() {
  const randId = Math.floor(Math.random() * 151) + 1;
  fetch(`https://pokeapi.co/api/v2/pokemon/${randId}`)
    .then(res => res.json())
    .then(p => {
      output.innerHTML = "";
      createCard(p);
    });
}

function populateTypes(pokemonList) {
  const types = new Set();
  pokemonList.forEach(p => p.types.forEach(t => types.add(t.type.name)));
  typeFilter.innerHTML = '<option value="all">All Types</option>';
  [...types].sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = capitalize(t);
    typeFilter.appendChild(opt);
  });
}

function resetPage() {
  inputName.value = "";
  typeFilter.value = "all";
  error.textContent = "";
  fetchPokemonList();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

fetchPokemonList();


