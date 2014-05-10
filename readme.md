# Connect Four

This repo is for people who want to work at Social Tables. And whoever
else wants to join in.  For those who want to start from scrach, you should check out the [Gen 1 project](https://github.com/socialtables/connect-four/tree/version1)

The goal is to make a really sweet Connect Four app. Check out the
current version [on Heroku](http://damp-shore-9247.herokuapp.com/)

## Game Background
There are several variations of the game, but for this project we're
using the basic [Hasbro rules](http://www.hasbro.com/common/documents/dad2614d1c4311ddbd0b0800200c9a66/1EF6874419B9F36910222EB9858E8CB8.pdf)

## Setup Instructions
- We've created the backend server end points for you to interact with.
- Make sure you have node.js installed. Find it here: [nodejs.org](http://nodejs.org)
- Install the dependencies by typing `npm install` in your terminal inside the project directory.
- Launch the node.js game server by typing `node app.js` in your terminal.
- Navigate to localhost:3000 to view the Connect 4 app
- Modify the index.ejs file to create the user interface for the game

## Basic Functional Requirements (Don't break!)  
These were completed by @necaris in Gen 1 of this project.
- A user should be able to start a new game
- A user should be presented with a game grid with 6 rows and 7
  columns
- Each game should have two players who have different color game
  pieces
- Players should be able to alternate turns placing their game pieces
- Players should only be able to place game pieces in valid grid slots
- Whenever a player has won the game, a notification message should
  appear with the results and a way to start a new game

## API Basics
- Refer to the code in game.js as your documentation on how to
  interact with the game server
- Each game has a unique id `uuid`
- The game board is represented by a 7x6 2D array
- Making a request to `/new` will give you a new game id and clean
  grid
- To place a piece, make a POST request to `/save/:id` and include the
  entire updated 2D array

## Submission
- Create a fork of the repo
- Commit and push your code to your forked repo as many times as you
  want
- Submit a pull request to the master branch when you're
  done. Congrats!

## Contributors
- mcwhittemore: Game concept and API
- necaris: Version 1 of Functional Game
- jmoss20: Responsive Front-End Design
- edkim: Documentation and Typos
