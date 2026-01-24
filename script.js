const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 10;
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


async function onloadFunc(){
    console.log("yes");
    loadData();
}

async function loadData() {
    showLoadingSpinner();
    let startTime = Date.now();

    if(ALLPOKEMON.length >= MAX_POKEMON) {
        hideLoadMore();
        hideLoadingSpinner();
        return;
    }

    let remaining = MAX_POKEMON - ALLPOKEMON.length;
    let limitNow = Math.min(LIMIT, remaining);
    let url = `${BASE_URL}?limit=${limitNow}&offset=${offset}`;
    // oberen 3 zeilen damit zum schluss nicht 160 pokemos geladen weren
    let response = await fetch(url);
    let data = await response.json();

    let newPokemons = data.results;

    for (let index = 0; index < newPokemons.length; index++) {
        let types = await loadType(newPokemons[index].url);
        newPokemons[index].type = types;
    }

    ALLPOKEMON = ALLPOKEMON.concat(newPokemons);
    offset = offset + limitNow;
    currentPokemons = ALLPOKEMON;
    renderPokemon();

    if (ALLPOKEMON.length >= MAX_POKEMON) {
        hideLoadMore();
    }

    let elapsed = Date.now() - startTime;
    let minTime = 1000;

    if (elapsed < minTime) {
        await sleep(minTime - elapsed);
    }

    hideLoadingSpinner();
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function hideLoadMore() {
    let loadMoreBtn = document.getElementById("loadMoreBtn");
    loadMoreBtn.style.display = "none";
}

function showLoadMore(){
    let loadMoreBtn = document.getElementById("loadMoreBtn");
    loadMoreBtn.style.display = "block";
}

function loadMorebtn() {
    loadData();
}


function init(){
    currentPokemons = ALLPOKEMON;
    renderPokemon()
}

function filterAndShowPokemons(filterWord){
    filterWord = filterWord.toLowerCase();

    if (filterWord.length < 3) {
        currentPokemons = ALLPOKEMON;
        renderPokemon();
        showMinLettersHint();
        showLoadMore();
        return;
    }
    
    hideMinLettersHint();

    currentPokemons = ALLPOKEMON.filter(pokemon => pokemon.name.toLowerCase().includes(filterWord))

    renderPokemon();
    hideLoadMore();
}

function showMinLettersHint() {
    document.getElementById('min_letters_hint').style.display = 'block';
}

function hideMinLettersHint() {
    document.getElementById('min_letters_hint').style.display = 'none';
}

async function loadType(path="") {
    let response = await fetch(path);
    let responseToJson = await response.json();
    let data = responseToJson.types;
    return data;
}

async function openFullImg(index) {
    showLoadingSpinner();

    let pokemon = currentPokemons[index]; /* angeklickte pokemon aus der liste*/
    let response = await fetch(pokemon.url);
    let data = await response.json();

    let parts = pokemon.url.split("/");
    let pokemonIndex = parts[parts.length - 2]
    fullImg.src = img_font + pokemonIndex + ".png";

    let typeName = data.types[0].type.name;
    fullImg.className = "bg_" + typeName;

    renderDialogTypeIcons(data);
    renderStats(data); /* lässt stats anzeigen */
    
    fullImgBox.style.display = "flex"; /* lässt dialog öffnen */

    hideLoadingSpinner();

}

function backgroundClick(event){ /* Beim klick auf den Hintergrund */
    if (event.target === fullImgBox){ /* Wenn das geklickte Element direkt die Lightbox ist (nicht das Bild) */
        closeFullImg(); /* Dann die Lightbox schliessen */
    }
}

function closeFullImg(){
    fullImgBox.style.display = "none" /* Schliesst das Lightbox-Overlay */
    fullImg.className = "";
}

function showLoadingSpinner(){
    document.getElementById("loadingSpinner").style.display = "flex";
}

function hideLoadingSpinner(){
    document.getElementById("loadingSpinner").style.display = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toPercent(value){
    let percent = (value / 200) * 100;
    if (percent > 100) percent = 100;
    return percent;
}