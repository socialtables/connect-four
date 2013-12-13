# Connect Four

This repo is for people who want to work at Social Tables.

The goal is to make a really sweet Connect Four app.

## Game Background
There are several variations of the game, but for this project let's use the basic [Hasbro rules](http://www.hasbro.com/common/documents/dad2614d1c4311ddbd0b0800200c9a66/1EF6874419B9F36910222EB9858E8CB8.pdf)


## Objectives for Project Completion
- A user should be able to start a new game
- A user should be presented with a game grid with 6 rows and 7 columns
- Each game should have two players who have different color game pieces
- Players should be able to alternate turns placing their game pieces
- Players should only be able to place game pieces in valid grid slots
- Whenever a player has won the game, a notification message should appear with the results and a way to start a new game

## Guidelines
- You are free to use whatever client side libraries you want.
- The entire application interface should be a single page using index.ejs
- We'll be judging your UI and design skills. Make it easy to play. Try to make it look good too, but we understand you have limited time.

## Setup Instructions
- We've created the backend server end points for you to interact with.
- Make sure you have node.js installed. Find it here: [nodejs.org](http://nodejs.org)
- Launch the node.js game server by typing `node app.js` in your terminal
- Navigate to localhost:3000 to view the Connect 4 app
- Modify the index.ejs file to create the user interface for the game

## API Basics
- Refer to the code in game.js as your documentation on how to interact with the game server
- Each game has a unique id `uuid`
- The game board is represented by a 7x6 2D array
- Making a request to `/new` will give you a new game id and clean grid
- To place a piece, make a POST request to `/save/:id` and include the entire updated 2D array
- Fair warning: You may encounter some warts whilst working with this API. First, try to work around them. If you find a show stopping bug, let us know!

## Submission
- Create a fork of the repo
- Commit and push your code to your forked repo as many times as you want
- Submit a pull request to the master branch when you're done. Congrats!