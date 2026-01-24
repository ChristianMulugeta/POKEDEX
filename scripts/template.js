function renderStats(data){
    let statsBox = document.getElementById("fullImgStats");

    let heightMeter = (data.height / 10).toFixed(1);
    let weightKg = (data.weight / 10).toFixed(1);
    let typeNames = [];

    for (let index = 0; index < data.types.length; index++) {
        let typeObject = data.types[index];
        let name = typeObject.type.name;
        typeNames.push(name);
    }
    let typesText = typeNames.join(" / ");

    let attack = data.stats[1].base_stat;
    let defense = data.stats[2].base_stat;

    let attackPercent = toPercent(attack);
    let defensePercent = toPercent(defense);

    statsBox.innerHTML = `
        <div class="stat-row">
            <span class="stat-label">Name:</span>
            <span class="stat-value">${capitalize(data.name)}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Height:</span>
            <span class="stat-value">${heightMeter} m</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Weight:</span>
            <span class="stat-value">${weightKg} kg</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Base Exp.:</span>
            <span class="stat-value">${data.base_experience}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Type:</span>
            <span class="stat-value">${typesText}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">Attack:</span>
            <span class="stat-value">${attack}</span>
            <div class="stat_bar">
                <div class="stat_bar_fill" style="width: ${attackPercent}%"></div>
            </div>
        </div>

        <div class="stat-row">
            <span class="stat-label">Defense:</span>
            <span class="stat-value">${defense}</span>
            <div class="stat_bar">
                <div class="stat_bar_fill" style="width: ${defensePercent}%"></div>
            </div>
        </div>
    `;
}

function renderDialogTypeIcons(data) {
    let container = document.getElementById("dialogTypeIcons");
    let html = "";

    for (let index = 0; index < data.types.length; index++) {
        let typeName = data.types[index].type.name;

        html += `
            <img
                class= "type_icon"
                src="${img_element + typeName}.png"
                alt="${typeName}"
                title="${typeName}"
            />
        `;    
    }
    
    container.innerHTML = html;
}

function renderTypeIcons(pokemon) {
    let html = "";
    for (let index = 0; index < pokemon.type.length; index++) {
        let typeName = pokemon.type[index].type.name;
        html += `
            <img
                class="type_icon"
                src="${img_element + typeName}.png"
                alt="${typeName}"
                title="${typeName}"
            />
        `;
    }
    return html;
}

function renderPokemon(){
    let html = "";
    for (let index = 0; index < currentPokemons.length; index++) {
        let pokemon = currentPokemons[index];        
        let parts = pokemon.url.split("/");
        let pokemonIndex = parts[parts.length - 2];
        let typeName = pokemon.type[0].type.name;
        html +=`
        <div class="pokemon_card">
            <div class="pokemon_name">
                <h2>#${pokemonIndex} ${capitalize(pokemon.name)}</h2>
            </div>
            <div class="pokemon_img" onclick="openFullImg(${index})">
                <img class="bg_${typeName}" src= "${img_font + pokemonIndex}.png" alt="${pokemon.name}"/>
            </div>
            <div class="pokemon_elements">
                ${renderTypeIcons(pokemon)}
            </div>
        </div>
        `;
    }
    pokemonList.innerHTML = html;
    console.log("renderet grad");
 
    
}