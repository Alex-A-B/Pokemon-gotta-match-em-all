// test linkages 

// const para = document.createElement("p")
// para.innerText = "General Kenobi"
// document.getElementById("start").appendChild(para)

// fetch() code and console log

const BASEURL = "https://pokeapi.co/api/v2/pokemon?limit=151"

let fillPokedex = (pokemon) => {
    let pokeURL = pokemon.url
    fetch(pokeURL)    
    .then(response => response.json())
    // .then(pokemon => console.log(pokemon)) 
    .then(pokemon => renderCards(pokemon)) 
}

const pokemonArray = [];

const fillGameBoard = function(pokeArray){
    pokeArray.forEach(pokemon => fillPokedex(pokemon))
}

let randomPokemonId = () => {
    return Math.floor(Math.random() * 151)
}


const setPokemonArray = function(pokedexArray) {
        for (let i = 0; i < 8; i++){
        let num = randomPokemonId();
        let pokemon = pokedexArray.results[num];
        pokemonArray.push(pokemon)
        console.log(pokemonArray)
    }
    fillGameBoard(pokemonArray)
}

fetch(BASEURL)
.then(response => response.json())
// .then(pokedex => pokedex.results.forEach(pokemon => console.log(pokemon)))
.then(pokedex => setPokemonArray(pokedex))


// check console log - expect ID, title and image ID object.

const gameBoard = document.querySelector(".gameBoard");

// render cards
const renderCards = function(pokedex) {
// card
const createCard = document.createElement("div")
createCard.className = "card"
// card front
const createCardFront = document.createElement("div")
createCardFront.className = "card-front"
// front elements - name, image, info panel
const cardHeader = document.createElement("h2")
cardHeader.innerText = `${pokedex.species.name.toUpperCase()}`                  /* to get from data api */
createCardFront.appendChild(cardHeader)

const cardImage = document.createElement("img")
cardImage.className = "card-image"
cardImage.src = pokedex.sprites.other[`official-artwork`].front_default         /* to get from data api */
createCardFront.appendChild(cardImage)

/* not needed for MVP */
// const cardInfo = document.createElement("p")
// cardInfo.className = "card-info"
// cardInfo.innerText = "some interesting facts about the image"    /* to get from data api */
// createCardFront.appendChild(cardInfo)

// card back
const createCardBack = document.createElement("div")
createCardBack.className = "card-back"

// put it together
createCard.appendChild(createCardFront);
createCard.appendChild(createCardBack);
gameBoard.appendChild(createCard)
};




/*
What is a card?

create div.card
create div.card__face
create div.card__back

card__face elements
create nameplate (h3?)
create image
create info plate (type, environment/region)

card__back element
card image/css to build?


from Fetch get images
ID link to image
image to sit inside card

*/