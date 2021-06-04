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
const fillGameBoard = function(gameArray){
    gameArray.forEach(pokemon => fillPokedex(pokemon))
}
/* function to create the cards based on initial fetch info, which *
 * is then worked to create the gameBoard with the cards in play.  */
const fillPokedex = (pokemon) => {
    let pokeURL = pokemon.url
    fetch(pokeURL)    
    .then(response => response.json())
    // .then(pokemon => console.log(pokemon))        /* to view poke specific pokemon api in console*/
    .then(pokemon => renderCards(pokemon)) 
}

/* Converted to a function, and called by DOMLoaded eventListener  *
 * will be added to a restart/new game button. and play again      */
const startGame = function() {
        fetch(BASEURL)
        .then(response => response.json())
        // .then(pokedex => pokedex.results.forEach(pokemon => console.log(pokemon)))
        .then(pokedex => setPokemonArray(pokedex))
    }


const gameBoard = document.querySelector(".gameBoard");

/* card render function - builds the cards for the game. Scaled back *
 * for MVP - may need to add an ID# for logic checking when matching */
// render cards
const renderCards = function(pokedex) {
// card
const createCard = document.createElement("div")
createCard.className = "card"
createCard.dataset.face = "down"
createCard.addEventListener("click", cardflip)
// card front
const createCardFront = document.createElement("div")
createCardFront.className = "card-front"
createCardFront.dataset.dexid = pokedex.id
createCardFront.style.display = "none"
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
createCardBack.style.display = "block"

const cardBackImg = document.createElement("img")
cardBackImg.className = "card-back"
cardBackImg.src = "assets/cardBack.png"
createCardBack.appendChild(cardBackImg)

// put it together
createCard.appendChild(createCardFront);
createCard.appendChild(createCardBack);
gameBoard.appendChild(createCard)
};

// const cardFront = document.querySelector(".card-front")
// const cardBack = document.querySelector(".card-back")

let activeCards = []; // array for active cards

const cardBecomesActive = function(card) {
    activeCards.push(card);
    let length = activeCards.length;
    console.log(activeCards)
    if (length === 2) {
        if(activeCards[0].firstChild.dataset.dexid === activeCards[1].firstChild.dataset.dexid) {
            console.log("we have a match")
            activeCards = []; /* ADD function/graphic bloom for correct */
        } else {
            console.log("we didn't match")
            setTimeout(function(){
                activeCards.forEach(card => cardReset(card));
                activeCards = [];
            }, 1200);
        }
    }
}


const cardReset = function(card) {
    card.dataset.face = "down"
    card.lastChild.style.display = "block"
    card.firstChild.style.display = "none"
    card.classList.toggle("disabled") 
}


// cardflip function - checks dataset-face value if up, then 'flip' displays
// by displaying front, hiding back.
// placeholder ELSE before card match logic is applied. 
const cardflip = function() {
    if (this.dataset.face === "down") {
        this.dataset.face = "up"
        this.lastChild.style.display = "none"
        this.firstChild.style.display = "block"
        this.classList.toggle("disabled")
        cardBecomesActive(this)
    } 
}

/* Event Listener to get functioning Restart button */
const pokeball = document.querySelector(".restart")

pokeball.addEventListener("click", () => {
    location.reload()
})


/* DOM loaded event listener to arrange game assets on load */
document.addEventListener("DOMContentLoaded", startGame)

