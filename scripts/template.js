/*
1. Rendert die Stats im Detaildialog in die Box #fullImgStats.
2. Rechnet Grösse und Gewicht in m und kg um und formatiert es auf eine Nachkommastelle um.
3. Sammelt alle Typen aus data.type und gibt es mit / dazwischen zurück.
4. Liest Attack und Defense aus data.stats, rechnet sie über topercent() in Balkenbreiten aus.*/
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

/*
1. Zeigt die TypeIcons eines Pokemon im dialogTypeIcons.
2. Geht alle Typen in data.types durch baut für jeden Typ ein img mit der passenden icon URL.
3. Setzt html in den container ein.*/
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

/*
1. Erstellt die TypeIcons für die Pokemon Karte in der Übersicht.
2. Nimmt pokemon.type und baut pro typ ein img
3. Gibt den html string zurück damit es in renderPokemonCars() eingefügt wird.
*/
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

/*
1. Rendert die Übersichtsliste aller aktuellen Sichtbaren Pokemon.
2. Erstellt das html über renderPokemonCards(html) und setzt es in pokemon_list.
3. Wenn currentPokemons nichts anzeigt dann wird Not found meldung angezeigt.*/
function renderPokemon(){
    let html = "";
    html = renderPokemonCards(html);
    pokemonList.innerHTML = html;
 
    if(currentPokemons.length === 0){
        showNotFound();
    } else{
        hideNotFound();
    }
    
    console.log("renderet grad");
}

/*
1. Erstellt in currentPokemons die Karten html struktur.
2. Holt die Pokemon ID aus der pokemon.url und diese wird verwendet umd das Bild zu laden und die Nummer anzuzeigen.
3. Setzt auf den Typ angepasst eine Hintergrundklasse fürs Bild (bg_${typeName}) und fügt die TypeIcons über renderTypeIcons(pokemon) ein.
4. Gibt den kompletten html string zurück.*/
function renderPokemonCards(html){
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
                    <img class="bg_${typeName}" src="${img_font + pokemonIndex}.png" alt="${pokemon.name}"/>
                </div>
                <div class="pokemon_elements">
                    ${renderTypeIcons(pokemon)}
                </div>
            </div>
            `;
    }
    return html;
}