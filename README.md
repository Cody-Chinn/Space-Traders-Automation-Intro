# Space-Traders-Automation-Intro
An introduction to automation looping in the game Space Traders

## Introduction
Space traders is a backend to a trading game in space. The front end was intentionally left out so people could learn how to interact with RESTful API's. There are already a ton of awesome projects being created for this game and can be found in the [community discord](https://discord.gg/tQcRvx6a). This repo is dedicated to the beginners that want to learn how to create automation loops to really max out your credits.

# Getting started
 - Create a directory to keep this code in
 - Open the cmd line or terminal and navigate to the newly created folder
 - run ```git clone https://github.com/Cody-Chinn/Space-Traders-Automation-Intro.git```
 - open your editor (I use [VS Code](https://code.visualstudio.com/download))
 - Edit the index file a desired username
 - Make sure you have [Node JS](https://nodejs.org/en/download/) installed and then run ```npm install``` from your cmd line or terminal
    - tip for VS Code users: the keybind commands ``` control + ` ``` to open the terminal
 - Once all of the packages are installed, run ```npm start```
 - That's it! All of the important data should now be outputting to the terminal 😃

# Todo:
## Testing in the API
- [ ] flightplans
    - [ ] getFlightPlansInSystem
    - [ ] getFlightPlanById
    - [x] submitNewFlightPlan
- [ ] game
    - [ ] getGameStatus
- [ ] loans
    - [ ] getAvailableLoans
    - [ ] getCurrentLoans
    - [ ] payoffLoan
    - [x] requestNewLoan
- [ ] locations
    - [ ] getLocationInfo
    - [ ] getDockedShipsInfo
    - [ ] getLocationsInSystem
- [ ] marketplace
    - [ ] getMarketInfo
- [x] purchase orders
    - [x] placePurchaseOrder
- [x] sell orders
    - [x] sellGoods
- [ ] ships
    - [x] buyShip
    - [ ] getAvailableShips
    - [ ] getShipInfoById
    - [ ] getPlayersShips
    - [ ] jettisonCargo
    - [ ] scrapShip
- [ ] systems
    - [ ] getSystemInfo
- [x] users
    - [x] createNewUser
    - [x] getUserInfo

## Index changes
- [x] Add error checking for each call
- [ ] Add a loop to go back and forth to each planet