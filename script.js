const output = document.getElementById("output");
const searchInput = document.getElementById("input-name");
const error = document.getElementById("error");

let allPokemon = [];

async function fetchAllPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await res.json();
    const results = data.results;

    const detailedData = await Promise.all(
      results.map(p => fetch(p.url).then(res => res.json()))
    );
    allPokemon = detailedData;
    renderPokemon(allPokemon);
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
  const filtered = allPokemon.filter(poke =>
    poke.name.toLowerCase().includes(searchTerm)
  );
  renderPokemon(filtered);
}

function getRandomPokemon() {
  const random = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  renderPokemon([random]);
}

function resetPokemonList() {
  searchInput.value = "";
  renderPokemon(allPokemon);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllPokemon();
  searchInput.addEventListener("input", filterPokemon);

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", resetPokemonList);
  document.querySelector("header").appendChild(resetButton);
});
