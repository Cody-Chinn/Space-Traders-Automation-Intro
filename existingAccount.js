const prompt = require('prompt-sync')({sigint: true});
const users = require('./Api/users.js');
const ships = require('./Api/ships.js');
const loans = require('./Api/loans.js');
const preFlight = require('./preflightPrep.js');
const flightPlans = require('./Api/flightPlans.js');
const locations = require('./Api/locations.js');
const purchase = require('./Api/purchaseOrders.js');

/**
 * Log the player in and request which ships (if any) to use
 */
async function retrievePlayerData(){
    const playerInfo = await login();
    console.log(`That checks out, now lets decide which ship to use for the automation.`);
    const shipId = await selectShip(playerInfo);
    
    const loopData = {
        username: playerInfo.user.username,
        token: playerInfo.token,
        shipId,
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
    const shipList = playerInfo.user.ships;

    if(shipList.length == 0){
        console.log(`No ships found. Let's get you in brand new hot rod.`);
        const shipId = await tryBuyShip(playerInfo);
        return shipId;
    } else if(shipList.length == 1){
        console.log(`You only have one ship located at ${shipList[0].location}`);
        console.log(`This ship will be emptied of all it's contents to make the loop work.`);
        const permissionToFly = prompt('Is it ok to use this ship for automation?(Y/N) ');
        if(permissionToFly == 'y' || permissionToFly == 'Y' ||
            permissionToFly == 'yes' || permissionToFly == 'Yes'){
            return shipList[0].id;
        } else {
            const buyShipAnswer = prompt('Can we try to purchase a ship on the moon for you?(Y/N)');
            if(buyShipAnswer == 'y' || buyShipAnswer == 'Y' ||
                buyShipAnswer == 'yes' || buyShipAnswer == 'Yes'){
                const newShipId = await tryBuyShip(playerInfo);
                return newShipId;
            } 
            
            throw new Error(`We need a ship for the automation loop. Once you want to stop being difficult we can try this again.`);
        }
    } else {
        console.log(`Looks like we have some options so we'll leave that up to you.`);
        console.log(`We've found ${shipList.length} ships in your fleet and need to know which one you want to send to OE-PM-TR to start the automation loop.`);
        shipList.forEach((ship, ndx) => {
            console.log(`Ship #${ndx+1}: Currently on ${ship.location}. ID: ${ship.id}`);
        });

        console.log(`This ship will be emptied of all it's contents to make the loop work.`);
        const shipId = await getMultiShipPrompt(shipList);
        return shipId;
    }
}

async function getMultiShipPrompt(shipList){
    const selection = prompt(`Which ship number do you want to use for the loop starting at OE-PM-TR? `);
    // Using -1 here to adjust for calling the ship list 1-5 instead of 0-4
    if(shipList[selection-1]){
        return shipList[selection-1].id;
    } else {
        console.log(`I'm not seeing that here. Try a different one.`);
        getMultiShipPrompt(shipList);
    }
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

    const newShip = await ships.buyShip(playerInfo.user.username, playerInfo.token, 'OE-PM-TR', 'JW-MK-I');
    if(newShip.error){
        console.log('ERROR PURCHASING SHIP FOR EXISTING USER');
        console.log('---------------------------------------');
        throw new Error(newShipId.error);
    }
    console.log(`Just bought a shiny new Jackshaw on the moon! We'll use this bad boy to start making big bucks!`)
    return newShip.user.ships[0].id;

}
exports.retrievePlayerData = retrievePlayerData;