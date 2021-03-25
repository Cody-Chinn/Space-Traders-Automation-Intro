# Space-Traders-Automation-Intro

## Introduction
Space traders is a backend to a trading game in space. The front end was intentionally left out so people could learn how to interact with RESTful API's. There are already a ton of awesome projects being created for this game and can be found in the [community discord](https://discord.gg/tQcRvx6a). This repo is dedicated to the beginners that want to learn how to create automation loops to really max out your credits.

## Getting started
 - Create a directory to keep this code in
 - Open the cmd line or terminal and navigate to the newly created folder
 - run ```git clone https://github.com/Cody-Chinn/Space-Traders-Automation-Intro.git```
 - open your editor (I use [VS Code](https://code.visualstudio.com/download))
 - Edit the index file a desired username
 - Make sure you have [Node JS](https://nodejs.org/en/download/) installed and then run ```npm install``` from your cmd line or terminal
    - tip for VS Code users: the keybind commands ``` control + ` ``` to open the terminal
 - Once all of the packages are installed, run ```npm start```
 - That's it! All of the important data should now be outputting to the terminal 😃

## How to use the repo
I've added comments throughout to help even the newest of programmers try to analyze how this program works but I'll start at the top.
- At the top level we have the index, readme, and package.json files. 
    - The package.json files are what tell npm what to download when running ```npm install``` and what file to run when running ```npm start```. There arent many in this project, but each package has its importance to keep the program running. I highly advise against editing these files manually.
    - The index file is where the magic happens. When running ```npm start``` node will run this file which kicks off the automation. Any editing that needs to be done to the loop or the ships needs to happen here.
    - Then of course there's the readme, license and node_modules folder which should be ignored during development.
- The API folder
    - Each folder represents a section of the API found at [https://api.spacetraders.io/](https://api.spacetraders.io/) and each function represents a different call to make to the API.
    - To use any of these functions, use ```js var *varName* = require('./Api/*filename*.js)```, then access the functions with ```js *varName*.*functionName*(*parameters*);```]
    - To really optimize a loop, try to run each function to get a feel for the platform and how to play the game.

# Todo:
## Index changes
- [x] Add error checking for each call
- [x] Test each error step
- [ ] Add a loop to go back and forth to each planet

## Repo needs
- [x] Description of how the folder structure works

## Testing in the API - Each function has been tested and works as intended
- [x] flightplans
    - [x] getFlightPlansInSystem
    - [x] getFlightPlanById
    - [x] submitNewFlightPlan
- [x] game
    - [x] getGameStatus
- [x] loans
    - [x] getAvailableLoans
    - [x] getCurrentLoans
    - [x] payoffLoan
    - [x] requestNewLoan
- [x] locations
    - [x] getLocationInfo
    - [x] getDockedShipsInfo
    - [x] getLocationsInSystem
- [x] marketplace
    - [x] getMarketInfo
- [x] purchase orders
    - [x] placePurchaseOrder
- [x] sell orders
    - [x] sellGoods
- [x] ships
    - [x] buyShip
    - [x] getAvailableShips
    - [x] getShipInfoById
    - [x] getPlayersShips
    - [x] jettisonCargo
    - [x] scrapShip
- [x] systems
    - [x] getSystemInfo
- [x] users
    - [x] createNewUser
    - [x] getUserInfo
