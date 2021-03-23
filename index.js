const flightPlans = require('./Api/flightPlans.js');
const loans = require('./Api/loans.js');
const purchaseOrder = require('./Api/purchaseOrders.js');
const sellOrders = require('./Api/sellOrders.js');
const ships = require('./Api/ships.js');
const users = require('./Api/users.js');

async function startScript(){
    
    // Each call made to the api has a flow of index.js -> Api/{endpoint}.js -> apiCall.js
    // This is to cut down on the amount of copy/pasted code in each file so each file used 
    // in the index will need to be required at the top in order to use the functions
    const userTest = await users.createNewUser('TestSpaceScorpion20');
    
    // Lets get make sure the username isn't taken first
    if(!userTest.user.username){
        console.log('Looks like that username is taken :( ');
        return;
    }

    // Kickoff the automation and notify the user of their token
    console.log(`Hello ${userTest.user.username}, beginning your automation now!`)
    console.log(`You'll want to save this token. It's pretty important ${userTest.token}`);
    
    // Take out a loan so we can purchase a ship
    await loans.requestNewLoan(userTest.user.username, userTest.token, 'STARTUP');
    
    console.log(`Loan recieved, taking 1.5 second nap`);

    // The api has a 2 call per second limit so we need to sleep long enough
    // to be to make calls again. You'll see more of these throughout the script
    await sleep(1500);
    
    // Buy a ship and grab the Id for future functions
    const meNewShip = await ships.buyShip(userTest.user.username, userTest.token, 'OE-PM-TR', 'JW-MK-I');
    const meNewShipId = meNewShip.user.ships[0].id;
    
    // Purchase Fuel for the newly aquired ship
    await purchaseOrder.placePurchaseOrder(userTest.user.username, userTest.token, meNewShipId, 'FUEL', 20);
    console.log(`Fueled up, lets get some cargo after a 1.5 second nap`);
    await sleep(1500);

    // Buy some METAL goods so we can sell it on another planet
    await purchaseOrder.placePurchaseOrder(userTest.user.username, userTest.token, meNewShipId, 'METALS', 80);

    // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
    // To get more info on locations you can use the functions in the locations file 
    const flightplan = await flightPlans.submitNewFlightPlan(userTest.user.username, userTest.token, meNewShipId, 'OE-PM');
    console.log(flightplan);
    console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);
    await sleep(90000);

    // Sell all of the METAL material on your ship for profit
    await sellOrders.sellGoods(userTest.user.username, userTest.token, meNewShipId, 'METALS', 80);
    
    // As a nice feature, there's an output of anything that could be considered useful
    // to the person running the script. None of the lines below are part of the automation
    // process but do increase quality of life for the user
    console.log(`Tutorial automation finished. \nHere is some useful data to continue using this account.\n-------------------------------------------------------------------------------------------`);

    const userData = await users.getUserInfo(userTest.user.username, userTest.token); 
    console.log('User information');
    console.log(userData);

    userData.user.ships.forEach((ship, ndx) => {
        console.log(`Ship #${ndx+1}`)
        console.log(ship);
    });

    userData.user.loans.forEach((loan, ndx) => {
        console.log(`Loan #${ndx+1}`)
        console.log(loan);
    });
}

// This helps us take pauses in between function calls so we don't
// over step our 2 call per second limit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

startScript();