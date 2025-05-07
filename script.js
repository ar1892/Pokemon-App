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
    document.getElementById("output").innerHTML = "";
  }
  
  async function fetchPokemon() {
    const name = document.getElementById("input-name").value.trim();
    if (!name) {
      showError("Please enter a Pokémon name.");
      return;
    }
    try {
      const data = await fetchPokemonData(name);
      displayPokemon(data);
    } catch (err) {
      showError("Pokémon not found. Try another name.");
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