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
 - That's it! Follow the prompts to start your first automation! 😃

## How to use the repo
I've added comments throughout to help even the newest of programmers try to analyze how this program works but I'll start at the top.
- At the top level we have the prompt scripts, readme, and package.json files. 
    - The package.json files are what tell npm what to download when running ```npm install``` and what file to run when running ```npm start```. There arent many in this project, but each package has its importance to keep the program running. I highly advise against editing these files manually.
    - The index file is the entry point to the process. When running ```npm start``` node will automatically run this file for you.
    - The newAccount and existingAccount files are scripts that prompt the user for a username, password and ship to use for looping.
    - The loop is where you'll want to do most of your editing. This is the loop of events for your ship to fly though.
        - You can configure what to buy sell at the top of this file where you see ```js materialOne = ...``` and further down where you see ```js materialTwo =...```
    - Then there's the readme, license and node_modules folder which should be ignored during development.
- The API folder
    - Each folder represents a section of the API found at [https://api.spacetraders.io/](https://api.spacetraders.io/) and each function represents a different call to make to the API.
    - To use any of these functions, use ```js var *varName* = require('./Api/*filename*.js)```, then access the functions with ```js *varName*.*functionName*(*parameters*);```]
    - This folder also contains enumerations of commonly used Strings like planet names and material types.
    - To really optimize a loop, try to run each function to get a feel for the platform and how to play the game.

# Todo:
## Start Script changes
- [x] Add error checking for each call
- [x] Test each error step
- [x] Add a loop to go back and forth to each planet
- [x] Make the username a prompt rather than a script edit
- [x] Create script to determine if user is new
- [x] Create start script for new user
- [x] Create alternative start script for existing user
    - [x] User without ships
    - [x] User with single ship
    - [x] User with multiple ships

## Repo needs
- [x] Description of how the folder structure works
- [x] Multiple prompts returning null?
- [ ] Configurable planets in the loop and preflight
- [x] Sleep function needs a home
- [x] Better comments in existing user script
- [x] Break up repeating functionalities?
- [x] ENUM for Material keys

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
