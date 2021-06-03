// fetch() code and console log

/*  variable to have the Base URL for the fetch - prevent typos! */
const BASEURL = "https://pokeapi.co/api/v2/pokemon?limit=151"

/*  function to set board size which is #pairs of chars to match *
 *  Will be looking to set some repeat protection via if in the  *
 *  loop. Seek to increase the board size for #pairs via toggle  */
const setPokemonArray = function(pokedexArray) {
    const pokemonArray = [];
    for (let i = 0; i < 8; i++) {
        let num = randomPokemonId();
        let pokemon = pokedexArray.results[num];
        pokemonArray.push(pokemon)
    }
    const gameArray = [...pokemonArray, ...pokemonArray]  
    fillGameBoard(gameArray)
}

/* get random number function for the gameBoard cards */
let randomPokemonId = () => {
    return Math.floor(Math.random() * 151)
}

/* function to take the game array and  */
const fillGameBoard = function(pokeArray){
    pokeArray.forEach(pokemon => fillPokedex(pokemon))
}
/* function to create the cards based on initial fetch info, which *
 * is then worked to create the gameBoard with the cards in play.  */
const fillPokedex = (pokemon) => {
    let pokeURL = pokemon.url
    fetch(pokeURL)    
    .then(response => response.json())
    // .then(pokemon => console.log(pokemon)) 
    .then(pokemon => renderCards(pokemon)) 
}

/* need to add this to a function rather than just on load, so it  *
 * can be added to a restart/new game button.                      */
fetch(BASEURL)
.then(response => response.json())
// .then(pokedex => pokedex.results.forEach(pokemon => console.log(pokemon)))
.then(pokedex => setPokemonArray(pokedex))


const gameBoard = document.querySelector(".gameBoard");

/* card render function - builds the cards for the game. Scaled back *
 * for MVP - may need to add an ID# for logic checking when matching */
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
cardHeader.innerText = `${pokedex.species.name.toUpperCase()}`                 
createCardFront.appendChild(cardHeader)

const cardImage = document.createElement("img")
cardImage.className = "card-image"
cardImage.src = pokedex.sprites.other[`official-artwork`].front_default        
createCardFront.appendChild(cardImage)

/* not needed for MVP */
// const cardInfo = document.createElement("p")
// cardInfo.className = "card-info"
// cardInfo.innerText = "some interesting facts about the image"                
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