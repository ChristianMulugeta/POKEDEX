function renderStatsTemplate(data, heightMeter, weightKg, typesText, attack, defense, attackPercent, defensePercent) {
    return `
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

function renderDialogTypeIconsTemplate(typeName){
    return `
            <img
                class= "type_icon"
                src="${img_element + typeName}.png"
                alt="${typeName}"
                title="${typeName}"
            />
        `; 
}

function renderTypeIconsTemplate(typeName) {
    return `
            <span class="type_badge type_${typeName}">
                <img
                    class="type_icon"
                    src="${img_element + typeName}.png"
                    alt=""
                />
                ${capitalize(typeName)}
            </span>
        `;
}

function renderPokemonCardsTemplates(index, pokemon, pokemonIndex, typeName){
    return `
            <article class="pokemon_card bg_${typeName}" onclick="openFullImg(${index})">
                <div class="pokemon_name">
                    <span>#${String(pokemonIndex).padStart(3, "0")}</span>
                    <h2>${capitalize(pokemon.name)}</h2>
                </div>
                <div class="pokemon_img">
                    <img src="${img_font + pokemonIndex}.png" alt="${capitalize(pokemon.name)}"/>
                </div>
                <div class="pokemon_elements">
                    ${renderTypeIcons(pokemon)}
                </div>
            </article>
            `;
}
