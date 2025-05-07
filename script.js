const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };
  
  async function fetchPokemonData(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
  
  function displayPokemon(pokemon) {
    const output = document.getElementById("output");
    const errorBox = document.getElementById("error");
    errorBox.textContent = "";
  
    const primaryType = pokemon.types[0].type.name;
    const bgColor = typeColors[primaryType] || '#f8f8f8';
  
    output.style.backgroundColor = bgColor;
  
    output.innerHTML = `
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <img src="${pokemon.sprites.front_default}" alt="Image of ${pokemon.name}">
      <div class="stats">
        <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
        <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
        <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
      </div>
    `;
  }
  
  function showError(message) {
    document.getElementById("error").textContent = message;
    const output = document.getElementById("output");
    output.innerHTML = "";
    output.style.backgroundColor = 'white';
  }
  
  async function fetchPokemon() {
    const name = document.getElementById("input-name").value.trim();
    if (!name) {
      showError("Please enter a Pokémon name or ID.");
      return;
    }
    try {
      const data = await fetchPokemonData(name);
      displayPokemon(data);
    } catch (err) {
      showError("Pokémon not found. Try another name or ID.");
    }
  }
  
  async function getRandomPokemon() {
    const id = Math.floor(Math.random() * 898) + 1;
    try {
      const data = await fetchPokemonData(id);
      displayPokemon(data);
    } catch (err) {
      showError("Could not load random Pokémon.");
    }
  }