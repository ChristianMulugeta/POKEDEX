const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20;
const MAX_POKEMON = 151;
const pokemonList = document.getElementById("pokemon_list");
const pokeApiOffset = 0;
const img_font = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const TYPE_URL = "https://pokeapi.co/api/v2/type/";
const img_element = "https://fastly.jsdelivr.net/npm/pokemon-assets@1.0.5/type-icons/";
const fullImgBox = document.getElementById("fullImgBox"); /* Holt das Element mit der ID "fullImgBox" aus dem DOM */ 
const fullImg = document.getElementById("fullImg"); /* Holt das Bild Element welches das Grosse Bild anzeigt */
const searchInput = document.getElementById("searchInput");

let offset = 0;
let ALLPOKEMON = [];
let currentPokemons = [];
let currentPkm = 0;

/*Startfunktion beim Lader der Seite (Startet das Nachladen der Pokemon)*/ 
async function onloadFunc(){
    loadData();
}

/*
1. Lädt die nächsten Pokemon stückweise nach.
2. Zeigt Spinner, prüft ob schon MAX_POKEMON geladen sind, holt neue Pokemon über fetschNextPokemon, hängt sie an ALLPOKEMON, aktualisiert offset, setzt currentPokemons und ruft renderPokemon()*auf.
3. Versteck den "Load more" btn wenn alles geladen ist.
4. Wartet mind. 1sek, dann Spinner aus.*/
async function loadData() {
    showLoadingSpinner();
    let startTime = Date.now();
    if(ALLPOKEMON.length >= MAX_POKEMON) { hideLoadMore(); hideLoadingSpinner();
        return;
    }
    let { newPokemons, limitNow} = await fetchNextPokemon();
    ALLPOKEMON = ALLPOKEMON.concat(newPokemons);
    offset = offset + limitNow;
    currentPokemons = ALLPOKEMON;
    renderPokemon();
    if (ALLPOKEMON.length >= MAX_POKEMON) hideLoadMore();
    let elapsed = Date.now() - startTime;
    let minTime = 1000;
    if (elapsed < minTime) await sleep(minTime - elapsed);
    hideLoadingSpinner();
}

/*
1. Holt die nächst Seite aus der PokeAPI mit limit und offset.
2. Berechnet, wie viele noch fehlen damit nicht über 151 geladen werden.
3. Für jedes neue Pokemon lädt es zusätzliche Typen über loadType(pokemon.url) und speichert sie in pokemon.type.
4. Gibt newPokemons und limitNow zurück */
async function fetchNextPokemon() {
    let remaining = MAX_POKEMON - ALLPOKEMON.length;
    let limitNow = Math.min(LIMIT, remaining);
    let url = `${BASE_URL}?limit=${limitNow}&offset=${offset}`;
    let response = await fetch(url);
    let data = await response.json();

    let newPokemons = data.results;
    for (let index = 0; index < newPokemons.length; index++) {
        let types = await loadType(newPokemons[index].url);
        newPokemons[index].type = types;
    }
    return { newPokemons, limitNow};
}

/*
1. Öffnet die Detail Ansicht (Lightbox) für ein Pokemon aus der aktuellen Liste.
2. Speichtert den ausgewählten Index in currentPkm.
3. Lädt die Detaildaten pokemon.url, setzt ds grosse Bild fullImg.src und stzt eine Hintergrundklasse nach Typ bg_typeName.
4. Ruft renderDialogTypeIcons(data) und renderStats(data) auf um Typ-Icons und Stats im Dialog anzuzeigen.
5. Zeigt die Lightbox an und blockiert Scrollen mit no-scroll*/
async function openFullImg(index) {
    currentPkm = index;
    let pokemon = currentPokemons[index];
    let response = await fetch(pokemon.url);
    let data = await response.json();
    let parts = pokemon.url.split("/");
    let pokemonIndex = parts[parts.length - 2]
    fullImg.src = img_font + pokemonIndex + ".png";
    let typeName = data.types[0].type.name;
    fullImg.className = "bg_" + typeName;
    renderDialogTypeIcons(data);
    renderStats(data);    
    fullImgBox.style.display = "flex";
    document.body.classList.add("no-scroll");
    hideLoadingSpinner();
}

/*
1. Lädt die Pokemon Daten von der URL und gibt nur die Typen zurück.
2. Gibt ein Array mit den Typen des Pokemons mit return data an responseToJson.types zurück.*/
async function loadType(path="") {
    let response = await fetch(path);
    let responseToJson = await response.json();
    let data = responseToJson.types;
    return data;
}

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

    statsBox.innerHTML = renderStatsTemplate(data, heightMeter, weightKg, typesText, attack, defense, attackPercent, defensePercent);
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

        html += renderDialogTypeIconsTemplate(typeName);
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
        html += renderTypeIconsTemplate(typeName);
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
        html += renderPokemonCardsTemplates(index, pokemon, pokemonIndex, typeName);
    }
    return html;
}

/*
1. Filtert die Pokemonliste nach Namen und rendert neu.
2. Unter 3 Buchstaben zeigt es alle Pokemon, den Hinweis min. 3 letters, Loadmore und versteckt das NotFound.
3. Ab 3 Bustaben filtert es ALLPOKEMON nach Namen, rendert ergebnis und versteckt Loadmore.
4. Wenn nichts gefunden wird zeigt es NOtFound an.*/
function filterAndShowPokemons(filterWord){
    filterWord = filterWord.toLowerCase();
    if (filterWord.length < 3) {
        currentPokemons = ALLPOKEMON;
        renderPokemon();
        showMinLettersHint();  showLoadMore(); hideNotFound();
        return;
    }
    hideMinLettersHint();
    currentPokemons = ALLPOKEMON.filter(pokemon => pokemon.name.toLowerCase().includes(filterWord));
    renderPokemon(); hideLoadMore();
    if(currentPokemons.length === 0){ showNotFound();
    } else{ hideNotFound();
    }
}

/*
1. Setzt akteulle Anzeige wieder auf alle geladenen Pokemon(ALLPOKEMON) und redert neu.*/
function init(){
    currentPokemons = ALLPOKEMON;
    renderPokemon()
}

/*
1. Wechselt in der Lightbox zum nächsten Pokemon.
2. Mit event.stopPropagation() verhinder man das wenn man den nextbtn klickt den hintergrund klick auslöst.
3. Erhöht currentPkm um eins. Wenn das letzte Pokemon erreicht ist, springt es wieder zum ersten.
4. openFullImg wird aufgerufen */
function nextPokemon(event){
    event.stopPropagation();
    currentPkm = (currentPkm + 1) % currentPokemons.length;
    openFullImg(currentPkm);
}

/*
1. Wechselt in der Lightbox zum vorherigen Pokemon.
2. Mit event.stopPropagation() verhinder man das wenn man den nextbtn klickt den hintergrund klick auslöst.
3. Verringert currentPkm um eins. Wenn das erste Pokemon erreicht ist, springt es wieder zum letzten.
4. openFullImg wird aufgerufen*/
function prevPokemon(event){
    event.stopPropagation();
    currentPkm = (currentPkm - 1 + currentPokemons.length) % currentPokemons.length;
    openFullImg(currentPkm)
}

/*
1. Beim klick auf den Hintergrund
2. Wenn das geklickte Element direkt die Lightbox ist (nicht das Bild)
3. Dann die Lightbox schliessen*/
function backgroundClick(event){ 
    if (event.target === fullImgBox){
        closeFullImg();
    }
}

/*
1. Schliesst das Lightbox.
2. Versteckt das Overlay, entfernt Hintergrundklasse am Bild und aktiviert scrollen wieder.*/
function closeFullImg(){
    fullImgBox.style.display = "none"
    fullImg.className = "";
    document.body.classList.remove("no-scroll");
}

/*
1. Macht den ersten Bustaben gross.*/
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/*
1. Versteckt den loadMoreBtn*/
function hideLoadMore() {
    let loadMoreBtn = document.getElementById("loadMoreBtn");
    loadMoreBtn.style.display = "none";
}

/*
1. Zeigt den loadMoreBtn*/
function showLoadMore(){
    let loadMoreBtn = document.getElementById("loadMoreBtn");
    loadMoreBtn.style.display = "block";
}

/*
1. Mit loadMorebtn lädt es die nächste Seite über loadData. */
function loadMorebtn() {
    loadData();
}

/*
1. Zeigt den Hinweis min. 3 letters an.*/
function showMinLettersHint() {
    document.getElementById('min_letters_hint').style.display = 'block';
}

/*
1. Versteckt den Hinweis min. 3 letters.*/
function hideMinLettersHint() {
    document.getElementById('min_letters_hint').style.display = 'none';
}

/*
1. Zeigt den Loadingspinner an.*/
function showLoadingSpinner(){
    document.getElementById("loadingSpinner").style.display = "flex";
}

/*
1. Versteckt den Loadingspinner.*/
function hideLoadingSpinner(){
    document.getElementById("loadingSpinner").style.display = "none";
}

/*
1. Pausiert den Code für eine bestimmte Zeit ohne die Seite zu blockieren damit der Loadspinner kurz sichtbar wird. */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
1. Rechnet einen Wert in Prozent um, bezogen auf 200 als max.
2. Wenn es über 100% ist wird nur 100% angezeigt.*/
function toPercent(value){
    let percent = (value / 200) * 100;
    if (percent > 100) percent = 100;
    return percent;
}

/*
1. Zeigt die Meldung Pokemon not found an.*/
function showNotFound(){
    document.getElementById("notFoundMessage").style.display = "block";
}

/*
1. Versteckt die Meldung Pokemon not found.*/
function hideNotFound(){
    document.getElementById("notFoundMessage").style.display= "none";
}




// leere dateien löschen  ----------------------------------------  done
// console.log entfernen  ----------------------------------------  done
// temlates anpassen  --------------------------------------------  done
// horizontale scrollbar ganz rechts beim hovern entfernen -------  done
// such btn hinzufügen  ------------------------------------------  done