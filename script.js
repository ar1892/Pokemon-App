const output = document.getElementById("output");
const errorDisplay = document.getElementById("error");

function renderPokemon(pokemon) {
  output.innerHTML = "";
  errorDisplay.textContent = "";

  const card = document.createElement("div");
  card.className = "card-area";

  const img = document.createElement("img");
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;

  const title = document.createElement("h2");
  title.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

  const stats = document.createElement("div");
  stats.className = "stats";

  pokemon.stats.forEach(stat => {
    const p = document.createElement("p");
    p.textContent = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
    stats.appendChild(p);
  });

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(stats);
  output.appendChild(card);
}

function fetchPokemon() {
  const name = document.getElementById("input-name").value.trim().toLowerCase();
  if (!name) {
    errorDisplay.textContent = "Please enter a Pokémon name.";
    output.innerHTML = "";
    return;
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon not found");
      return response.json();
    })
    .then(data => renderPokemon(data))
    .catch(err => {
      errorDisplay.textContent = err.message;
      output.innerHTML = "";
    });
}

function getRandomPokemon() {
  const id = Math.floor(Math.random() * 898) + 1;
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => response.json())
    .then(data => renderPokemon(data))
    .catch(err => {
      errorDisplay.textContent = "Failed to load random Pokémon.";
      output.innerHTML = "";
    });
}