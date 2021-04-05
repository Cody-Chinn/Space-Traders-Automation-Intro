const prompt = require('prompt-sync')({sigint: true});
const users = require('./Api/users.js');
const ships = require('./Api/ships.js');
const loans = require('./Api/loans.js');
const {systems} = require('./Api/locationNames.js');

/**
 * Retrieve the 3 things that are absolutely needed to run the loop
 * 1) Username
 * 2) Token
 * 3) Ship ID
 * @returns {Object} Object to run the loop with the username, token and shipId 
 *  of the ship that will be running the loop
 */
async function retrievePlayerData(){
    const playerInfo = await login();
    console.log(`That checks out, now lets decide which ship to use for the automation.\n\n`);
    const shipId = await selectShip(playerInfo);
    
    const loopData = {
        username: playerInfo.user.username,
        token: playerInfo.token,
        shipId,
    }

    return loopData;
    
}

/**
 * Attempt to login to the players account with a prompt. If it fails, try again
 * @returns {Object} The verified information of the of the user - username and token
 */
async function login(){
    // Request the username and token from the user
    let playerName = prompt(`You looked familiar! What\'s your callsign cadet? `);
    let playerToken = prompt(`${playerName}, of course! What's your token? `);

    // Send the data from the prompts to the API to verify the account
    const playerData = await users.getUserInfo(playerName, playerToken);
    if(playerData.error){
        console.log(`\nThat's not in the system... let's try that again`);
        return login();
    }

    // Add the token to the player data for ease of access
    playerData.token = playerToken;

    return playerData;
}

/**
 * There's 3 scenarios to check for when selecting a ship from the user
 * 1) No ships - buy one
 * 2) 1 ship - is it ok to use it or should one be bought?
 * 3) multiple ships - present the list of ships to the user and have them pick which one to use or buy one
 * @param {Object} playerInfo Contains all data from the https://api.spacetraders.io/users/:username endpoint and the users token
 * @returns {String} The ID of the ship to run the loop
 */
async function selectShip(playerInfo){
    const shipList = playerInfo.user.ships;

    // Part 1: does the user even have a ship?
    if(shipList.length == 0){
        console.log(`No ships found. Let's get you in brand new hot rod.`);
        return await tryBuyShip(playerInfo);
    // Part 2: The user only has 1 ship. Can we use it?
    } else if(shipList.length == 1){
        console.log(`You only have one ship located at ${shipList[0].location}`);
        console.log(`This ship will be emptied of all it's contents to make the loop work.`);
        const permissionToFly = prompt('Is it ok to use this ship for automation?(Y/N) ');
        if(permissionToFly == 'y' || permissionToFly == 'Y' ||
            permissionToFly == 'yes' || permissionToFly == 'Yes'){
            return shipList[0].id;
        } else {
            // The user didn't want to use that ship, try to buy one
            const buyShipAnswer = prompt('Can we try to purchase a ship on the moon for you?(Y/N)');
            if(buyShipAnswer == 'y' || buyShipAnswer == 'Y' ||
                buyShipAnswer == 'yes' || buyShipAnswer == 'Yes'){
                return await tryBuyShip(playerInfo);
            }

            throw new Error(`The loop needs a ship but we're out of options. Try again with a different account or buy a ship for the loop`);
        }
    } else {
        // Part 3: The user has multiple ships. Show them all of their ships or ask to buy one
        console.log(`Looks like we have some options so we'll leave that up to you.`);
        console.log(`We've found ${shipList.length} ships in your fleet and need to know which one you want to send to OE-PM-TR to start the automation loop.\n`);
        shipList.forEach((ship, ndx) => {
            console.log(`Ship #${ndx+1}: Currently on ${ship.location}. ID: ${ship.id}`);
        });

        console.log(`This ship will be emptied of all it's contents to make the loop work.\n`);
        return await getMultiShipPrompt(playerInfo);
    }
}

/**
 * Prompt the user to pick a ship from their fleet to use or to buy a ship
 * @param {Object} playerInfo Contains all data from the https://api.spacetraders.io/users/:username endpoint and the users token
 * @returns {String} The id of the selected ship
 */
async function getMultiShipPrompt(playerInfo){
    console.log(`Which ship number do you want to use for the loop starting at OE-PM-TR?`)
    const selection = prompt(`You can select a number or use B for buy. `);

    if(selection == 'B' || selection == 'b' ||
        selection == 'Buy' || selection == 'buy'){
            return await tryBuyShip(playerInfo);
    // Using -1 here to adjust for calling the ship list 1-5 instead of 0-4
    } else if(playerInfo.user.ships[selection-1]){
        return playerInfo.user.ships[selection-1].id;
    } else {
        console.log(`I'm not seeing that here. Try a different one.`);
        getMultiShipPrompt(playerInfo);
    }
}

/**
 * Try to buy a ship on Tritus (Primes moon)
 * @param {Object} playerInfo Contains all data from the https://api.spacetraders.io/users/:username endpoint and the users token
 * @returns {String} The id of a newly bought ship
 */
async function tryBuyShip(playerInfo){
    
    // Get a list of ships that the user can buy
    const availableShips = await ships.getAvailableShips(playerInfo.token);
    let shipPrice;
    availableShips.ships.forEach(ship => {
        if(ship.type == "JW-MK-I"){
            // set the ship price to the Jackshaw price on the moon
            shipPrice = ship.purchaseLocations[0].price;
        }
    });
    
    // check the players loan list for a length of 0, take out a loan if it is a length of 0 and they don't have credits to buy one
    if(playerInfo.user.loans.length == 0 && playerInfo.user.credits < shipPrice){
        console.log(`You can't afford a ship and you don't currently have loans. Let's get a loan taken out for you!`);
        const loan = await loans.requestNewLoan(playerInfo.user.username, playerInfo.token, 'STARTUP');
        if(loan.error){
            console.log('\nERROR TAKING OUT LOAN FOR EXISTING USER: ');
            console.log('-------------------------------------------');
            throw new Error(loan.error.message);
        }
        console.log(`Loan received! Here's the ID, you'll need that to pay it back --> ${loan.user.loans[0].id}`);
    // check the credits against the cost of a Jackshaw
    } else if(playerInfo.user.credits < shipPrice){
        console.log(`Looks like you're a little short on cash. Unfortunately we can't start the trade loop without a ship on the moon.`);
        console.log(`You'll either need to make enough to buy another ship, or create a new account to start using the loop`);
        console.log(`Credits: ${playerInfo.user.credits}\nShip Price: ${shipPrice}`);
        throw new Error(`You'll either need to make enough to buy another ship, or create a new account to start using the loop. Exiting script`);
    }

    const newShip = await ships.buyShip(playerInfo.user.username, playerInfo.token, systems.OE.PMTR, 'JW-MK-I');
    if(newShip.error){
        console.log('ERROR PURCHASING SHIP FOR EXISTING USER');
        console.log('---------------------------------------');
        throw new Error(newShipId.error);
    }
    console.log(`Just bought a shiny new Jackshaw on the moon! We'll use this bad boy to start making big bucks!`)
    return newShip.user.ships[0].id;
}

exports.retrievePlayerData = retrievePlayerData;