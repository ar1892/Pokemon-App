const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const pokemonList = document.getElementById('pokemon-list');
const pokemonDetails = document.getElementById('pokemon-details');
const detailsContent = document.getElementById('details-content');
const closeDetails = document.getElementById('close-details');
const searchInput = document.getElementById('search');

let allPokemon = [];

// Fetch the list of Pokémon
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        allPokemon = data.results;
        displayPokemon(allPokemon);
    })
    .catch(error => console.error('Error fetching Pokémon:', error));

// Display Pokémon cards
function displayPokemon(pokemonArray) {
    pokemonList.innerHTML = '';
    pokemonArray.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(pokeData => {
                const card = document.createElement('div');
                card.classList.add('pokemon-card');
                card.innerHTML = `
                    <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
                    <h3>${capitalize(pokeData.name)}</h3>
                `;
                card.addEventListener('click', () => showDetails(pokeData));
                pokemonList.appendChild(card);
            });
    });
}

// Show detailed information
function showDetails(pokemon) {
    detailsContent.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${capitalize(pokemon.name)}</h2>
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
        <p><strong>Types:</strong> ${pokemon.types.map(type => capitalize(type.type.name)).join(', ')}</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => capitalize(ability.ability.name)).join(', ')}</p>
    `;
    pokemonDetails.classList.remove('hidden');
}

// Close details view
closeDetails.addEventListener('click', () => {
    pokemonDetails.classList.add('hidden');
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
    displayPokemon(filteredPokemon);
});

// Capitalize function
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}