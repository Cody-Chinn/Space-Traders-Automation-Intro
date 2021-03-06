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
- At the top level we have the Start Scripts, Misc, API, readme, and package.json files. 
    - The package.json files are what tell npm what to download when running ```npm install``` and what file to run when running ```npm start```. There aren't many in this project, but each package has its importance to keep the program running. I highly advise against editing these files manually.
    - The index file is the entry point to the process. When running ```npm start``` node will automatically run this file for you.
- The API folder
    - Each folder represents a section of the API found at [https://api.spacetraders.io/](https://api.spacetraders.io/) and each function represents a different call to make to the API.
    - To use any of these functions, use ```js var *varName* = require('./Api/*filename*.js)```, then access the functions with ```js *varName*.*functionName*(*parameters*);```]
    - This folder also contains enumerations of commonly used Strings like planet names and material types.
    - To really optimize a loop, try to run each function to get a feel for the platform and how to play the game.
- The Start Scripts folder
    - The newAccount and existingAccount files are scripts that prompt the user for a username, password and ship to use for looping.
    - The loop is where you'll want to do most of your editing. This is the loop of events for your ship to fly though.
        - You can configure what to buy sell at the top of this file where you see ```js materialOne = ...``` and further down where you see ```js materialTwo =...```
- The Misc folder
    - Contains helper functions and test functions you can run with ```npm test```. Typically npm test is for running automated testing, but I found myself using this file to test individual functions regularly to make sure they work. You can use the OneTimeScripts file as a playground to try out functions and api calls.
- Then there's the readme, license and node_modules folder which should be ignored during development.

# The flow of the prompts and program
- Are you new? (yes) --> Create new account and run through all of the steps from the tutorial automatically to get a ship flying
- Are you new? (no) --> Ask for the username and password to login
    - once logged in
        - Get the number of ships the user has
            - Zero - Ask to buy and try to buy one on the moon if they say yes, otherwise exit the script
            - One - Ask to use the ship. If they say no, ask to buy one on the moon. If they still say no then exit the script.
            - Two or more - present a list of ships and ask which to use. The user can also buy a ship if they don't want to use one of theirs
- Loop & Profit! (If the user isn't profiting there is an error thrown to stop the loop to avoid heavy losses)

# My loops running... so what now?
Now it's time to learn the ins and outs of the market and how to modify the loop to work more efficiently. 

What's buying low and selling high? 

What happens if you open 2 terminals and try to run ships at the same time? How would you turn this into a one terminal operation? (hint: semaphores are an option for limiting calls)

How would you change the loop to get market data and maximize profit? (hint: most people send ships to each planet as probes)

Is there any simple change that can be made to the loop or preflight to make sure you're not wasting cargo space? (Do you really need that much fuel at the beginning?)

Learn how to teapot your ships! (or don't but cool people do)

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
- [x] Undefined ships in flight
- [x] Buying ship always returns a ship in flight bug
- [x] Description of how the folder structure works
- [x] Multiple prompts returning null?
- [x] Configurable planets in the loop and preflight
- [x] Sleep function needs a home
- [x] Better comments in existing user script
- [x] Break up repeating functionalities?
- [x] ENUM for material keys
- [x] ENUM for planet names

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
