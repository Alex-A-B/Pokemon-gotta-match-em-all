![Gotta match 'em all! logo](./assets/pokemonMatchGameLogo.png "Gotta Match 'em All!") 
# Gotta match 'em all!

Gotta match 'em all is a Pokemon memory game based on the first 151 Pokemon!  

## How to play

- Click a card to see the Pokemon beneath, then click another.

- If you get a match they will stay face up, if not they will flip back and you'll need to remember what was hiding beneath it again. 

- Repeat until all the Pokemon are matched! 

- Try for a place on the High Score Table! (or just delete the scores so you can be the very best!)

## Code Overview or How I built it

It is a Single Page Application (SPA) which is built from HTML, CSS and JavaScript.

Main images and name data is captured dynamically from the public API - [pokeAPI](https://pokeapi.co) via a series of JavaScript `fetch() GET` commands.

Utilises the **Fisher-Yates** or (**Knuth**) methodology to shuffle the playing deck, which, along with the random generation of the Pokemon in the deck to begin with, can lead to some less than random looking game boards. I made a blog post about it, you can find it here [NEED TO ADD LINK](medium.com)

Cards are dynamically created with vanilla JavaScript to alter the DOM. This also sets different CSS properties to apply suitably glitzy graphics.

A Pop-Up Modal is present and gives useful stats for how well you did and whether you made it to the top 10.

JavaScript `eventListeners` do a lot of the game features (which is the project requirement) however `setTimeout` also appears frequently to give a better gaming experience.

Localhost db.json server coded to track high scores and return a top 10 of them, you can fire it up in bash

```bash
    need to add which port its on
```

## Roadmap

To do 
- a delete high scores button!
- potentially a comments section
- a video feature review (coming soon, it's part of the project requirements!)
- some form of like system would be neat, not sure how to implement it though. 

