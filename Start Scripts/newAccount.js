const prompt = require('prompt-sync')({sigint: true});
const loans = require('../Api/loans.js');
const purchaseOrder = require('../Api/purchaseOrders.js');
const ships = require('../Api/ships.js');
const users = require('../Api/users.js');
const {materials} = require('../Api/materialTypes.js');
const {systems} = require('../Api/locationNames.js')
const help = require('../Misc/helpers.js');

/************************************************************************
 * Spins up an account for a brand new user
 * @returns {Object} Contains username, token and a newly bought ships ID
 ************************************************************************/
async function accountCreator(){
    
    // Step 1:  Create the account with the function at the bottom of this file
    const playerData = await requestUsername();
    if(playerData == null){
        return null;
    }
    // Stop the script if an error happened with the account creation
    if(playerData.error){
        console.log(playerData.error);
        return;
    }

    // Notify users of their username and token
    console.log(`\n\n${playerData.user.username}. I like that! Now pay attention to the next few lines.`);
    console.log(`You'll want to save this token. It's pretty important --> ${playerData.token}`);


    
    // Step 2: Take out a loan so we can purchase a ship
    const loan = await loans.requestNewLoan(playerData.user.username, playerData.token, 'STARTUP');
    if(loan.error){
        console.log('\nERROR TAKING OUT LOAN: ');
        console.log('-----------------------');
        console.log(loan.error.message);
        return;
    }

    console.log(`\n\nLoan received! Here's the ID, you'll need that to pay it back --> ${loan.user.loans[0].id}`)
    await help.sleep(1500);


    
    // Step 3: Buy a ship and grab the Id for future functions
    const meNewShip = await ships.buyShip(playerData.user.username, playerData.token, systems.OE.PMTR, 'JW-MK-I');
    if(meNewShip.error){
        console.log('\nERROR BUYING SHIP: ');
        console.log('-------------------');
        console.log(meNewShip.error.message);
        return;
    }
    const meNewShipId = meNewShip.user.ships[0].id;

    console.log(`Ship purchased! Here's the ID --> ${meNewShipId}`);



    // Step 4: Purchase Fuel for the newly aquired ship
    const initialFuelOrder = await purchaseOrder.placePurchaseOrder(playerData.user.username, playerData.token, meNewShipId, materials.FUEL, 20);
    if(initialFuelOrder.error){
        console.log('\nERROR BUYING FUEL: ');
        console.log('-------------------');
        console.log(initialFuelOrder.error.message);
        return;
    }
    console.log(`The ship is fueled up and ready to go! Let's start looping!`);
    await help.sleep(1500); 

    // Put all of the relavent data into it's own object and go back to the start script
    let loopData = {
        username: playerData.user.username,
        token: playerData.token,
        shipId: meNewShipId,
    }

    return loopData;
}

/***********************************************************************************
 * Request a username for the new account. This is in a separate function so 
 * it could be repeatedly called if the user tried a username that already existed
 * @returns {Object} The newly created accounts data
 ***********************************************************************************/
async function requestUsername(){
    // Send the requested user callsign to the api to create an accoun
    const playerNamePrompt = prompt('Yeah you look like a newbie, let\'s get you setup! What do you want your callsign to be? ');
    if(playerNamePrompt == null){
        return null;
    }
    const playerName = await users.createNewUser(playerNamePrompt);

    // Lets get make sure the username isn't taken before we continue. If it is, just
    // call this function again
    if(playerName.error){
        console.log('\nLooks Like that one\'s been taken, try a different one');
        requestUsername();
    }

    return playerName;
}

exports.accountCreator = accountCreator;