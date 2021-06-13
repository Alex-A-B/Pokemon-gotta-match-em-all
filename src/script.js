// fetch() code and console log

/*  variable to have the Base URL for the fetch - prevent typos!     */
const BASEURL = "https://pokeapi.co/api/v2/pokemon?limit=151"

/* Converted to a function, and called by DOMLoaded eventListener    *
 * will be added to a restart/new game button. and play again        */
 const startGame = function() {
    housekeeping();
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
// let randomPokemonId = function() {
//     return Math.floor(Math.random() * 151)
// }
let randomPokemonId = () => Math.floor(Math.random() * 151)


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
    // front elements - name, image
    const cardImage = document.createElement("img")
    cardImage.className = "card-image"
    cardImage.src = pokedex.sprites.other[`official-artwork`].front_default        
    createCardFront.appendChild(cardImage)
    const cardHeader = document.createElement("h2")
    cardHeader.innerText = `${pokedex.species.name}`                 
    createCardFront.appendChild(cardHeader)
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
        this.firstChild.style.display = "block"
        this.lastChild.style.display = "none"
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
    if (length === 1){
        if(turns === 0){
            startCounter();
            startTimer();
        }
    }    
    if (length === 2) {
        turns ++
        turncount.innerText = turns;
        if(activeCards[0].firstChild.dataset.dexid === activeCards[1].firstChild.dataset.dexid) {
            disableBoard();
            activeCards.forEach(card => card.style.backgroundImage = "radial-gradient(rgb(241, 241, 216), rgb(241, 245, 35))")
            activeCards.forEach(card => card.classList.toggle("match"))
            // activeCards[0].style.backgroundImage = "radial-gradient(rgb(241, 241, 216), rgb(241, 245, 35))";
            // activeCards[1].style.backgroundImage = "radial-gradient(rgb(241, 241, 216), rgb(241, 245, 35))";
            // activeCards[0].classList.toggle("match")
            // activeCards[1].classList.toggle("match")
            setTimeout(function(){
                activeCards.forEach(card => card.style.backgroundImage = "")
                // activeCards[0].style.backgroundImage = "";
                // activeCards[1].style.backgroundImage = "";
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
const modalRestartBall = document.querySelector(".restart-modal")

// restart function
const restartGame = () => {
    gameBoard.innerHTML = "";
    startGame();
}

const housekeeping = function(){
    clearInterval(clockTimer)
    clearInterval(scoreCounter)
    victoryModal.style.display = "none";         /* turned off as resets on refresh while styling */
    turns = 0, second = 0, minute = 0, hour = 0, counter = 0
    // turns = 0;
    // second = 0;
    // minute = 0;
    // hour = 0;
    // counter = 0;
    gameTimer.innerHTML = `${hour} hrs : ${minute} mins : ${second} secs`
    turncount.innerText = turns;
    scoreCount.innerHTML = 0
    getHighScores()
}


const cards = document.getElementsByClassName("match")
const closeVictoryModal = document.querySelector(".close")
const victoryModal = document.querySelector(".victory");
const victoryMessage = document.querySelector(".victory-message")
let finalScore = 0
let finalTime = 0


const checkForWinCondition = function() {
    if(cards.length === 16) {
        clearInterval(clockTimer)
        clearInterval(scoreCounter)
        finalTime = gameTimer.innerHTML
        finalScore = scoreCount.innerHTML
        setTimeout(function(){
        victoryMessage.innerHTML = `Congratulations! You took <strong>${turns}</strong> turns to match 'em all!<br/>
                                        It took you <strong>${finalTime}</strong>.<br/>
                                        You earned ₽<strong>${finalScore}</strong>! ` ;
        victoryModal.style.display = "block";
        }, 600)
    }
}

// gameplay features section:
/* display turns - innerText*/
const turncount = document.querySelector(".turnCount")

/* display counter */
const gameTimer = document.querySelector(".gameTimer")
let second = 0, minute = 0, hour = 0;
let clockTimer;
const startTimer = function(){
    clockTimer = setInterval(function(){
        gameTimer.innerHTML = `${hour} hrs : ${minute} mins : ${second} secs`
        second++
        if(second === 60){
            minute++;
            second = 0;
        }
        if(minute === 60){
            hour++;
            minute = 0;
        }
    }, 1000);
}

/* score maker*/
const scoreCount = document.querySelector(".scoreCount")
let counter = 0
let pointsScored
let scoreCounter
const startCounter = function(){
    scoreCounter = setInterval(function(){
        pointsScored = 1000 - (turns * counter);
        if (pointsScored < 0) {
            scoreCount.innerHTML = `0`
        }else{
            scoreCount.innerHTML = `${pointsScored}`
        };
        counter++ ;
    }, 1000);
}

/* ************************************************************ */
/* To get High Scores to work run "json-server --watch db.json" */
/* ************************************************************ */

// const highScores = document.querySelector(".highscores")
const highScoreList = document.querySelector(".highscore-list")
// high score Array
let highScores = [];

// a function that takes an array of highscores with name, turns and score
const scoreArrayMaker = function(highscoreArray) { 
    highScoreList.innerHTML = "";
    let tempArray = highscoreArray.sort((a, b) => b.score - a.score)
    highScores = tempArray.slice(0, 10)
    highScores.forEach(highscore => scoreLister(highscore));
}

const scoreLister = function(highscore){
        const li = document.createElement("li")
        li.innerText = `${highscore.name} earned ₽${highscore.score} and took a mere ${highscore.goes} turns to match 'em all!`;
        highScoreList.appendChild(li);
    
}

// post to db.JSON
const HIGHSCOREURL = "http://localhost:3000/highscores/"
const hsName = document.querySelector(".submit-highscore-form input[name='name']")
const hsSubmit = document.querySelector(".submit-highscore-form")

const userSubmitHighScore = function(){
    highScores.push({name: hsName.value, goes: turns, score: parseInt(finalScore, 10)})
    fetch(HIGHSCOREURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": hsName.value,
            "goes": turns,
            "score": parseInt(finalScore, 10),
        })
    })
    .catch(error => console.log(error.message))
}
// get high scores from server
const getHighScores = function(){
    fetch(HIGHSCOREURL)
    .then(response => response.json())
    .then(highscores => scoreArrayMaker(highscores))
}

hsSubmit.addEventListener("submit", function(event){
    event.preventDefault();         // don't refresh the page
    userSubmitHighScore();          // POST to db.json
    scoreArrayMaker(highScores);    // run the highscore table
    closeVictoryWindow();           // close the modal
    event.target.reset();           // reset the highscore form
    // no restart game as you may want to see how it ended and I wouldn't expect a submit highscore form to also restart my game.
})


// reset highscores 
// get high scores, jsonify, for loop through delete function...
// inefficiently effective.
const resetHighscores = () => {
    highScoreList.innerHTML = "";
    highScores = [];
    fetch(HIGHSCOREURL)
    .then(response => response.json())
    .then(scores => scores.forEach(score => fetch(`http://localhost:3000/highscores/${score.id}`, {method: "DELETE"})))
}

const hsResetBtn = document.querySelector(".reset-scores")

hsResetBtn.addEventListener("click", resetHighscores)

// helper function for modal event listeners
const closeVictoryWindow = function() {
    victoryModal.style.display = "none";     
}
// modal eventListeners
// on X
closeVictoryModal.addEventListener("click", closeVictoryWindow)
// on outside of modal content
document.addEventListener("click", function(e){
    if (e.target === victoryModal) {
       closeVictoryWindow()
    }
})

// helper functions for mouseover eventListener
const liftUp = function() {
    this.style.transform = "translateY(-2px)";
}
// helper function for mouseout eventListener
const putDown = function() {
    this.style.transform = "";
}

/* EventListener for modal restart button           */
modalRestartBall.addEventListener("click", restartGame);

/* Event Listener to get functioning Restart button */
restartPokeball.addEventListener("click", restartGame);

/* DOM loaded event listener to arrange game assets on load */
document.addEventListener("DOMContentLoaded", startGame);
