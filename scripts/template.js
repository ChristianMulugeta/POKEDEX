function renderStatsTemplate(data, pokemonName, heightMeter, weightKg, typesText, attack, defense, attackPercent, defensePercent) {
    return `
        <div class="stat-row">
            <span class="stat-label">${translate("name")}</span>
            <span class="stat-value">${pokemonName}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("height")}</span>
            <span class="stat-value">${heightMeter} m</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("weight")}</span>
            <span class="stat-value">${weightKg} kg</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("baseExperience")}</span>
            <span class="stat-value">${data.base_experience}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("type")}</span>
            <span class="stat-value">${typesText}</span>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("attack")}</span>
            <span class="stat-value">${attack}</span>
            <div class="stat_bar">
                <div class="stat_bar_fill" style="width: ${attackPercent}%"></div>
            </div>
        </div>

        <div class="stat-row">
            <span class="stat-label">${translate("defense")}</span>
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
                class="type_icon"
                src="${img_element + typeName}.png"
                alt="${translateType(typeName)}"
                title="${translateType(typeName)}"
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
                ${translateType(typeName)}
            </span>
        `;
}

function renderPokemonCardsTemplates(index, pokemon, pokemonIndex, typeName){
    let pokemonName = getPokemonName(pokemon);
    return `
            <article class="pokemon_card bg_${typeName}" onclick="openFullImg(${index})">
                <div class="pokemon_name">
                    <span>#${String(pokemonIndex).padStart(3, "0")}</span>
                    <h2>${pokemonName}</h2>
                </div>
                <div class="pokemon_img">
                    <img src="${img_font + pokemonIndex}.png" alt="${pokemonName}"/>
                </div>
                <div class="pokemon_elements">
                    ${renderTypeIcons(pokemon)}
                </div>
            </article>
            `;
}
