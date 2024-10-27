document.getElementById('searchInput').addEventListener('input', async function () {
    const query = this.value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    
    if (query) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        const data = await response.json();
        const filteredPokemon = data.results.filter(pokemon => pokemon.name.includes(query));

        if (filteredPokemon.length > 0) {
            suggestions.innerHTML = filteredPokemon.map(pokemon => `<li class="list-group-item" data-name="${pokemon.name}">${pokemon.name}</li>`).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    } else {
        suggestions.style.display = 'none';
    }
});

// Event delegation for suggestions
document.addEventListener('click', async function (event) {
    if (event.target.matches('.list-group-item')) {
        const name = event.target.getAttribute('data-name');
        await fetchPokemon(name);
        document.getElementById('suggestions').style.display = 'none';
    }
});

async function fetchPokemon(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error('Pokémon not found');
        
        const pokemon = await response.json();
        displayResult(pokemon);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
}

function displayResult(pokemon) {
    const pokeName = document.getElementById('pokeName');
    const pokeImg = document.getElementById('pokeImg');
    const pokeDescription = document.getElementById('pokeDescription');
    const pokeHP = document.getElementById('pokeHP');
    const pokeAttack = document.getElementById('pokeAttack');
    const pokeDefense = document.getElementById('pokeDefense');
    const pokeHeight = document.getElementById('pokeHeight');
    const pokeWeight = document.getElementById('pokeWeight');
    const pokeType = document.getElementById('pokeType');
    
    pokeName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokeImg.src = pokemon.sprites.front_default;
    pokeDescription.textContent = `Base Experience: ${pokemon.base_experience}`;
    
    // Set stats
    pokeHP.textContent = pokemon.stats[0].base_stat;
    pokeAttack.textContent = pokemon.stats[1].base_stat;
    pokeDefense.textContent = pokemon.stats[2].base_stat;
    pokeHeight.textContent = (pokemon.height / 10) + ' m'; // height in meters
    pokeWeight.textContent = (pokemon.weight / 10) + ' kg'; // weight in kilograms
    pokeType.textContent = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');

    // Set bars
    document.getElementById('hpBar').style.width = pokemon.stats[0].base_stat + '%';
    document.getElementById('attackBar').style.width = pokemon.stats[1].base_stat + '%';
    document.getElementById('defenseBar').style.width = pokemon.stats[2].base_stat + '%';
}

// Close suggestions on outside click
document.addEventListener('click', function (event) {
    if (!event.target.closest('.input-group')) {
        document.getElementById('suggestions').style.display = 'none';
    }
});
