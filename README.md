![Gotta match 'em all! logo](./assets/pokemonMatchGameLogo.png "Gotta Match 'em All!") 
# Gotta match 'em all!

Gotta match 'em all is a Pokemon memory game based on the first 151 Pokemon!  
---
---



## 🕹️ How to play 🕹️

- Click a card to see the Pokemon beneath, then click another.

- If you get a match they will stay face up, if not they will flip back and you'll need to remember what was hiding beneath it again. 

- Repeat until all the Pokemon are matched! 

- Try for a place on the High Score Table! (or just delete the scores so you can be the very best!)

---


## 💻 Code Highlights or How I built it 💻


It is a Single Page Application (SPA) which is built from HTML, CSS and JavaScript.

Main images and name data is captured dynamically from the public API - [pokeAPI](https://pokeapi.co) via a series of JavaScript `fetch() GET` commands.

Utilises the **Fisher-Yates** or (**Knuth**) methodology to shuffle the playing deck, which, along with the random generation of the Pokemon in the deck to begin with, can lead to some less than random looking game boards. I made a blog post about it, you can find it [here](https://alexa-b.medium.com/)

Cards are dynamically created with vanilla JavaScript to alter the DOM. This also sets different CSS properties to apply suitably lo-fi graphics.

A Pop-Up Modal is present and gives end game stats for how well you did and allows you to submit the socre and see if you made it to the top 10.

JavaScript `eventListeners` control a lot of the game features (which is the project requirement) however `setTimeout` also appears frequently to give a better game experience.

Game Stats - Turns, Time taken and Score (Money for theming purposes) update in real time on the DOM, these rely on `setTimeout` functions. The astute among you will notice there is both a Timer and a Counter - the Timer records Time, while the Counter records a Value which is used in score generation 

Localhost db.json server (http://localhost:3000/highscores) coded to track high scores and return a top 10 of them, you can fire it up in the terminal with: 

```bash
    json-server --watch db.json
```

--- 

## 🥳 Feature implementation 🥳

Utilised User story driven method to build out features. My principle stories were:

1. _As a user I expect to see a grid of cards, which I can click to turn pairs over. If I find a pair it should stay face up, otherwise revert to starting position._
    * A grid of cards was created with images and data drawn from the public API. 
    * A logic system was created which tested whether the cards matched, and stayed face up, or reset.

2. _As a user my grid of cards should be different every time I play._
    * From the public API acquire random sample of images up to game board size these were then added to the card deck. 
    * Utilised the **Fisher-Yates** method to shuffle the playing deck once created. 
    
3. _As a user I expect a card to have two sides, one should be uniform, the other displaying some image which I can find it'smatching pair._
    * A card is dynamically created using JavaScript DOM manipulation. 
    * Images are drawn from the the public API.

4. _As a user I expect to know when I have won the game._
    * A victory modal screen appears to advise sweet victory.

5. _As a user I would like to know how well I have done._ 
    * A series of game statistics has been created - turns, time taken and money earned (score).

6. _As a user I would like to see how I compare to others._
    * A high score table has been created, this is hosted on a localhost:3000 server.

These were the key stories I worked my way through, but within each sub-section of these broad stories, I looked to use the User story method to help hone what I was trying to build in the application. This ranged from _as a User I would expect this to look like ..._ to something more granular like _as a user I expect my score to update when I submit it_. This method allowed me to work through challenging problems while keeping the brief in mind, and focusing the code being written.  

---
## 🛠️ Possible New Features 🛠️

On the To-do list
- 🧰 a delete high scores button!
- 🧰 potentially a comments section
- 🧰 different viewport size support as only supported on fullscreen at present.
- 🧰 a video feature review (coming soon, it's part of the project requirements!)
- 🧰 some form of like system would be neat, not sure how to implement it though. 
- 🧰 light/dark modes


