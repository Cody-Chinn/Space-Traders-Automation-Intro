const prompt = require('prompt-sync')({sigint: true});
const users = require('./Api/users.js');
const ships = require('./Api/ships.js');
const loans = require('./Api/loans.js')
const flightPlans = require('./Api/flightPlans.js');
const locations = require('./Api/locations.js')

/**
 * Log the player in and request which ships (if any) to use
 */
async function retrievePlayerData(){
    const playerInfo = await login();
    const shipId = await selectShip(playerInfo);

    const shipInfo = await ships.getShipInfoById(playerInfo.user.username, playerInfo.token, shipId);

    const loopData = {
        username: playerInfo.user.username,
        token: playerInfo.token,
        shipId,
    }

    // Make sure the player is on the moon already, if not we'll need to get them there
    if(shipInfo.ship.location != 'OE-PM-TR'){
        const shipSentToTritus = await requestFlightToTritus(playerInfo.user.username, playerInfo.token, shipInfo);
        if(!shipSentToTritus){
            loopData.shipId = null;
            return loopData;
        }
    }

    return loopData;
}

/***********************************************************************************
 * Attempt to login to the players account. If it fails, try again
 * @returns {Object} The newly created accounts data
 ***********************************************************************************/
 async function login(){
    // Send the requested user callsign to the api to create an accoun
    const playerName = prompt(`You looked familiar! What\'s your callsign cadet? `);
    const playerToken = prompt(`${playerName}, of course! What's your token? `);

    const playerData = await users.getUserInfo(playerName, playerToken);
    if(playerData.error){
        console.log(`That's not in the system... let's try that again`);
        login();
    }

    playerData.token = playerToken;

    return playerData;
}

/*****************************************************************************
 * 
 * @param {List<String>} shipList the list of ships the player currently owns
 ****************************************************************************/
async function selectShip(playerInfo){
    console.log(playerInfo)
    const shipList = playerInfo.user.ships;

    if(shipList.length == 0){
        console.log(`No ships found. Let's get you in brand new hot rod.`);
        const shipId = await tryBuyShip(playerInfo);
        return shipId;
    } else if(shipList.length == 1){
        console.log(`You only have one ship located at ${shipList[0].location}`);
        const permissionToFly = prompt('Is it ok to use this ship for automation?(Y/N) ');
        if(permissionToFly == 'y' || permissionToFly == 'Y' ||
            permissionToFly == 'yes' || permissionToFly == 'Yes'){
            return shipList[0].id;
        } else {
            const newShipId = await tryBuyShip(playerInfo);
            return newShipId;
             
        }
    } else {
        console.log(`Looks like we have some options so we'll leave that up to you.`);
        console.log(`We've found ${shipList.length} ships in your fleet and need to know which one you want to send to OE-PM-TR to start the automation loop.`);
        shipList.forEach((ship, ndx) => {
            console.log(`Ship #${ndx+1}: Currently on ${ship.location}`);
        });

        const shipId = await getMultiShipPrompt();
        return shipId;
    }
}

async function getMultiShipPrompt(){
    const selection = prompt(`Which number do you want to send to OE-PM-TR? `);
    if(shipList[selection]){
        return shipList[selection].id;
    } else {
        console.log(`I'm not seeing that here. Try a different one.`);
        getMultiShipPrompt();
    }
}

async function requestFlightToTritus(username, token, shipData){
    console.log(`Looks like you don't have a ship on Tritus, which is where the loop starts. We'll need to get you there.`);
    if(shipData.ship.location){
        // calculate distance and buy the fuel needed to get there
        const myCoords = {
            x: shipData.ship.x,
            y: shipData.ship.y
        }

        const moonData = await locations.getLocationInfo(token, 'OE-PM-TR');
        const moonCoords = {
            x: moonData.location.x,
            y: moonData.location.y
        }

        const distance = Math.round(Math.sqrt(((moonCoords.x - myCoords.x) * (moonCoords.x - myCoords.x)) + ((moonCoords.y - myCoords.y) * (moonCoords.y - myCoords.y))));
        const fuelAmount = await getShipFuelAmount(shipData);

        if(fuelAmount < distance+1){
            const buyFuelPrompt = prompt(`We'll need to buy ${distance+1} fuel to make sure you get there safely is that okay?(y/n) `);
            if(buyFuelPrompt == 'Y' || buyFuelPrompt == 'y'
                ||buyFuelPrompt == 'Yes' || buyFuelPrompt == 'yes'){
                    console.log(`Bought the fuel! Lets go to the moon!`);
                    //Send ship to moon
                } else {
                    console.log(`If we can't buy the fuel, then we can't start the loop. Come back when you're ready to buy or have a ship on the moon.`);
                    return false;
                }
        } else {
            console.log(`Ship sent to the moon! Expected flight time is {time}`);
            // ship sent, wait the amount of time on the flight plan
        }
    } else if(shipData.ship.flightPlanId) {
        const flight = await flightPlans.getFlightPlanById(username, token, shipData);
        console.log(flight);
    }
}

async function getShipFuelAmount(shipData){
    console.log(shipData)
    shipData.ship.cargo.forEach(item => {
        if(item.good == 'FUEL'){
            return item.quantity;
        }
    });
    return 0;
}

async function tryBuyShip(playerInfo){
    // check playerinfo.user.loans for a length of 0, take out a loan if it is a length of 0
    // if it's not and the user already has a loan, check the credits against the cost of a Jackshaw
    // and ask the player if they can buy one. return the new ship id or null if they don't want to buy one
    const availableShips = await ships.getAvailableShips(playerInfo.token);
    let shipPrice;
    availableShips.ships.forEach(ship => {
        if(ship.type == "JW-MK-I"){
            shipPrice = ship.purchaseLocations[0].price;
        }
    });

    if(playerInfo.user.loans.length == 0 && playerInfo.user.credits < shipPrice){
        console.log(`You can't afford a ship and you don't currently have loans. Let's get a loan taken out for you!`);
        const loan = await loans.requestNewLoan(playerInfo.user.username, playerInfo.token, 'STARTUP');
        if(loan.error){
            console.log('\nERROR TAKING OUT LOAN FOR EXISTING USER: ');
            console.log('-------------------------------------------');
            throw new Error(loan.error.message);
        }
        console.log(`Loan received! Here's the ID, you'll need that to pay it back --> ${loan.user.loans[0].id}`);
    } else if(playerInfo.user.credits < shipPrice){
        console.log(`Looks like you're a little short on cash. Unfortunately we can't start the trade loop without a ship on the moon.`);
        console.log(`You'll either need to make enough to buy another ship, or create a new account to start using the loop`);
        console.log(`Credits: ${playerInfo.user.credits}\nShip Price: ${shipPrice}`);
        throw new Error(`You'll either need to make enough to buy another ship, or create a new account to start using the loop. Exiting script`);
    }

    const newShip = await ships.buyShip(playerInfo.user.username, playerInfo.token, 'OE-PM-TR', "JW-MK-I");
    if(newShip.error){
        console.log('ERROR PURCHASING SHIP FOR EXISTING USER');
        console.log('---------------------------------------');
        throw new Error(newShipId.error);
    }
    console.log(`Just bought a shiny new Jackshaw on the moon! We'll use this bad boy to start making big bucks!`)
    return newShip.user.ships[0].id;

}
exports.retrievePlayerData = retrievePlayerData;