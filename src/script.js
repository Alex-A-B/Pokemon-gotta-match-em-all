// fetch() code and console log

/*  variable to have the Base URL for the fetch - prevent typos!     */
const BASEURL = "https://pokeapi.co/api/v2/pokemon?limit=151"

/* Converted to a function, and called by DOMLoaded eventListener    *
 * will be added to a restart/new game button. and play again        */
 const startGame = function() {
    fetch(BASEURL)
    .then(response => response.json())
    // .then(pokedex => pokedex.results.forEach(pokemon => console.log(pokemon)))
    .then(pokedex => setPokemonArray(pokedex))
}

/*  function to set board size which is #pairs of chars to match     *
 *  Poss Features:                                                   *
 *  Will be looking to set some repeat protection via if in the      *
 *  loop. Seek to increase the board size for #pairs via toggle      */
const setPokemonArray = function(pokedexArray) {
    const pokemonArray = [];
    for (let i = 0; i < 8; i++) {
        let num = randomPokemonId();
        let pokemon = pokedexArray.results[num];
        pokemonArray.push(pokemon)
    }
    const gameArray = [...pokemonArray, ...pokemonArray]  
    // debugging code
    // console.log("initial arrays")
    // console.log(pokemonArray)
    // console.log(gameArray)
    // debugger
    fillGameBoard(gameArray)
}

/* get random number function for the gameBoard cards */
let randomPokemonId = function() {
    return Math.floor(Math.random() * 151)
}

/* hindsight and play tests have shown that relying on latency isn't optimal
 * A shuffle is required - JS has no native shuffle of an array.    *
 * the most popular method is the Fisher-Yates (or Knuth) Shuffle   */
const shuffleGame = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    // debugging code 
    // console.log("shuffled big array (used debugger to capture)")
    // console.log(array)
    // debugger
    return array;
};

let gameDeck = [];

/* function to take the game array and  */
const fillGameBoard = function(gameArray) {
    gameDeck = shuffleGame(shuffleGame(gameArray));
    // console.log(gameDeck)
    gameDeck.forEach(pokemon => fillPokedex(pokemon))
}
/* function to create the cards based on initial fetch info, which   *
 * is then worked to create the gameBoard with the cards in play.    */
const fillPokedex = (pokemon) => {
    let pokeURL = pokemon.url
    fetch(pokeURL)    
    .then(response => response.json())
    // .then(pokemon => console.log(pokemon))        /* to view poke specific pokemon api in console*/
    .then(pokemon => renderCards(pokemon)) 
}

/*  variable to quickly select the gameBoard div in the DOM          */ 
const gameBoard = document.querySelector(".gameBoard");

/* card render function - builds the cards for the game. Scaled back *
 * for MVP, name, image and ID taken from API to display and match.  */
// render cards
const renderCards = function(pokedex) {
    // card
    const createCard = document.createElement("div")
    createCard.className = "card"
    createCard.dataset.face = "down"
    createCard.addEventListener("click", cardflip)
    createCard.addEventListener("click", checkForWinCondition)
    // card front
    const createCardFront = document.createElement("div")
    createCardFront.className = "card-front"
    createCardFront.dataset.dexid = pokedex.id
    createCardFront.style.display = "none"
    // front elements - name, image, info panel

    const cardImage = document.createElement("img")
    cardImage.className = "card-image"
    cardImage.src = pokedex.sprites.other[`official-artwork`].front_default        
    createCardFront.appendChild(cardImage)

    const cardHeader = document.createElement("h2")
    cardHeader.innerText = `${pokedex.species.name}`                 
    createCardFront.appendChild(cardHeader)

    /* not needed for MVP */
    // const cardInfo = document.createElement("p")
    // cardInfo.className = "card-info"
    // cardInfo.innerText = "some interesting facts about the image"                
    // createCardFront.appendChild(cardInfo)

    // card back
    const createCardBack = document.createElement("div")
    createCardBack.className = "card-back"
    createCardBack.style.display = "block"
    createCardBack.addEventListener("mouseover", liftUp)
    createCardBack.addEventListener("mouseout", putDown)

    const cardBackImg = document.createElement("img")
    cardBackImg.className = "card-back"
    cardBackImg.src = "assets/cardBack.png"
    createCardBack.appendChild(cardBackImg)

    // put it together
    createCard.appendChild(createCardFront);
    createCard.appendChild(createCardBack);
    gameBoard.appendChild(createCard)
};

// modal stuff
const renderModal = function(){
    const modalDiv = document.createElement("div")
    modalDiv.className = "victory"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"

    const createClose = document.createElement("span")
    createClose.className = "close"
    createClose.innerText = "X"
    createClose.addEventListener("click", closeVictoryWindow)

    const createPara = document.createElement("p")
    createPara.innerText = `Congratulations! You took ${turns} turns to match 'em all!`

    modalContent.appendChild(createClose)
    modalContent.appendChild(createPara)
    modalDiv.appendChild(modalContent)
    document.body.appendChild(modalDiv)

}

// turn counter
let turns = 0

// const cardFront = document.querySelector(".card-front")
// const cardBack = document.querySelector(".card-back")


// cardflip function - checks dataset-face value if data-face = DOWN, 
// then 'flip' card displays by displaying front, hiding back.
// passes to new function cardBecomesActive
const cardflip = function() {
    if (this.dataset.face === "down") {
        this.dataset.face = "up"
        // // setTimeout(function(){this.lastChild.style.display = "none"}, 500);
        // this.lastChild.style.transform = "rotatey(180deg)";
	    // this.lastChild.style.transitionDuration = "0.5s";
        this.lastChild.style.display = "none"
        this.firstChild.style.display = "block"
        this.classList.toggle("disabled")
        cardBecomesActive(this)
    } 
}

// array for active cards
let activeCards = []; 

// active card function - push the card to activeCards array.
// checks array length, if length == 2 then checks for match, else carry on.
// if matched cards remain in face UP state, empties activeCard Array
// if not matched setTimeout function resets the card states, by calling cardReset
// for each card in array, then empties activeCard array
const cardBecomesActive = function(card) {
    activeCards.push(card);
    let length = activeCards.length;
    // console.log(activeCards)
    if (length === 2) {
        turns ++
        if(activeCards[0].firstChild.dataset.dexid === activeCards[1].firstChild.dataset.dexid) {
            disableBoard();
            activeCards[0].style.backgroundImage = "radial-gradient(rgb(241, 241, 216), rgb(241, 245, 35))";
            activeCards[1].style.backgroundImage = "radial-gradient(rgb(241, 241, 216), rgb(241, 245, 35))";
            activeCards[0].classList.toggle("match")
            activeCards[1].classList.toggle("match")
            setTimeout(function(){
                activeCards[0].style.backgroundImage = "";
                activeCards[1].style.backgroundImage = "";
                activeCards = [];
                enableBoard();
            }, 1200)            
        } else {
            disableBoard()
            setTimeout(function(){
                activeCards.forEach(card => cardReset(card));
                activeCards = [];
                enableBoard();
            }, 1200);
            
        }
    }
}
// cardReset Function resets the cards and removes disabled state
const cardReset = function(card) {
    card.dataset.face = "down"
    card.lastChild.style.display = "block"
    card.firstChild.style.display = "none"
    card.classList.toggle("disabled") 
}
// disables the board so you can't click extra cards 
const disableBoard = function() {
    gameBoard.classList.toggle("disabled")
}
// enables the board so you can click extra cards again
const enableBoard = function() {
    gameBoard.classList.toggle("disabled")
}

// to move to top 
const restartPokeball = document.querySelector(".restart")

// restart function
const restartGame = () => {
    turns = 0;
    gameBoard.innerHTML = "";
    startGame();
}

const cards = document.getElementsByClassName("match")
const closeVictoryModal = document.querySelector(".close")
const victoryModal = document.querySelector(".victory");
const victoryMessage = document.querySelector(".victory-message")

const checkForWinCondition = function() {
    if(cards.length === 16) {
        setTimeout(function(){
        victoryMessage.innerText = `Congratulations! You took ${turns} turns to match 'em all!`;
        victoryModal.style.display = "block";
        }, 600)
    }
}

const closeVictoryWindow = function() {
    victoryModal.style.display = "none";     
}

closeVictoryModal.addEventListener("click", closeVictoryWindow)

// helper functions for eventListener
const liftUp = function() {
    this.style.transform = "translateY(-2px)";
}
// helper function for eventListener
const putDown = function() {
    this.style.transform = "";
}

/* Event Listener to get functioning Restart button */
restartPokeball.addEventListener("click", restartGame);

/* DOM loaded event listener to arrange game assets on load */
document.addEventListener("DOMContentLoaded", () =>{
    // renderModal()
    startGame();
});