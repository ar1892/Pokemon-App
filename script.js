const output = document.getElementById("output");
const error = document.getElementById("error");
let allPokemon = [];

async function fetchAllPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    allPokemon = data.results;
    await displayPokemon(allPokemon);
  } catch (err) {
    error.textContent = "Failed to load Pokémon.";
  }
}

async function displayPokemon(pokemonList) {
  output.innerHTML = "";
  for (const poke of pokemonList) {
    const res = await fetch(poke.url);
    const data = await res.json();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <h3>${capitalize(data.name)}</h3>
    `;
    output.appendChild(card);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function filterPokemon() {
  const input = document.getElementById("input-name").value.toLowerCase();
  const filtered = allPokemon.filter(p => p.name.includes(input));
  displayPokemon(filtered);
}

function getRandomPokemon() {
  const rand = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  displayPokemon([rand]);
}

fetchAllPokemon();