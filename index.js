const flightPlans = require('./Api/flightPlans.js');
const loans = require('./Api/loans.js');
const purchaseOrder = require('./Api/purchaseOrders.js');
const sellOrders = require('./Api/sellOrders.js');
const ships = require('./Api/ships.js');
const users = require('./Api/users.js');
const market = require('./Api/marketplace.js');

async function startScript(){

    let loan = await loans.payoffLoan('TestSpaceScorpion21','3317adf1-d73b-4c6c-ac4c-307b60f25574', 'ckmmsvzj427710315s66743c724');
    console.log(loan)

    // // Each call made to the api has a flow of index.js -> Api/{endpoint}.js -> apiCall.js
    // // This is to cut down on the amount of copy/pasted code in each file so each file used 
    // // in the index will need to be required at the top in order to use the functions
    // const userTest = await users.createNewUser('TestSpaceScorpion22');

    // // Lets get make sure the username isn't taken first and display an error message if 
    // // there was one present on the returned json. These checks are placed throughout the
    // // loop to make sure each call works as expected
    // if(userTest.error){
    //     console.log('ERROR CREATING USER: ');
    //     console.log('---------------------');
    //     console.log(userTest.error.message);
    //     return;
    // }

    // // Kickoff the automation and notify the user of their token
    // console.log(`Hello ${userTest.user.username}, beginning your automation now!`);
    // console.log(`You'll want to save this token. It's pretty important --> ${userTest.token}`);
    
    // // Take out a loan so we can purchase a ship
    // const loan = await loans.requestNewLoan(userTest.user.username, userTest.token, 'STARTUP');
    // if(loan.error){
    //     console.log('ERROR TAKING OUT LOAN: ');
    //     console.log('-----------------------');
    //     console.log(loan.error.message);
    //     return;
    // }
    
    // console.log(`Loan recieved, taking 1.5 second nap`);

    // // The api has a 2 call per second limit so we need to sleep long enough
    // // to be to make calls again. You'll see more of these throughout the script
    // await sleep(1500);
    
    // // Buy a ship and grab the Id for future functions
    // const meNewShip = await ships.buyShip(userTest.user.username, userTest.token, 'OE-PM-TR', 'JW-MK-I');
    // if(meNewShip.error){
    //     console.log('ERROR BUYING SHIP: ');
    //     console.log('-------------------');
    //     console.log(meNewShip.error.message);
    //     return;
    // }
    // const meNewShipId = meNewShip.user.ships[0].id;
    
    // // Purchase Fuel for the newly aquired ship
    // const fuelOrder = await purchaseOrder.placePurchaseOrder(userTest.user.username, userTest.token, meNewShipId, 'FUEL', 20);
    // if(fuelOrder.error){
    //     console.log('ERROR BUYING FUEL: ');
    //     console.log('-------------------');
    //     console.log(fuelOrder.error.message);
    //     return;
    // }
    // console.log(`Fueled up, lets get some cargo after a 1.5 second nap`);
    // await sleep(1500);

    // // Buy some METAL goods so we can sell it on another planet
    // const metalOrder = await purchaseOrder.placePurchaseOrder(userTest.user.username, userTest.token, meNewShipId, 'METALS', 80);
    // if(metalOrder.error){
    //     console.log('ERROR BUYING METAL: ');
    //     console.log('--------------------');
    //     console.log(metalOrder.error.message);
    //     return;
    // }

    // // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
    // // To get more info on locations you can use the functions in the locations file 
    // const flightplan = await flightPlans.submitNewFlightPlan(userTest.user.username, userTest.token, meNewShipId, 'OE-PM');
    // if(flightplan.error){
    //     console.log('ERROR SUBMITTING FLIGHT PLAN: ');
    //     console.log('------------------------------');
    //     console.log(flightplan.error.message);
    //     return;
    // }

    // console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);
    // await sleep(90000);

    // // Sell all of the METAL material on your ship for profit
    // const sellOrder = await sellOrders.sellGoods(userTest.user.username, userTest.token, meNewShipId, 'METALS', 80);
    // if(sellOrder.error){
    //     console.log('ERROR SELLING METAL: ');
    //     console.log('---------------------');
    //     console.log(sellOrder.error.message);
    //     return;
    // }
    
    // // As a nice feature, there's an output of anything that could be considered useful
    // // to the person running the script. None of the lines below are part of the automation
    // // process but do increase quality of life for the user
    // console.log(`Tutorial automation finished. \nHere is some useful data to continue using this account.\n-------------------------------------------------------------------------------------------`);

    // const userData = await users.getUserInfo(userTest.user.username, userTest.token); 
    // if(userData.error){
    //     console.log('ERROR GETTING PLAYER DATA: ');
    //     console.log('---------------------------');
    //     console.log(userData.error.message);
    //     return;
    // }
    // console.log('User information');
    // console.log(userData);

    // userData.user.ships.forEach((ship, ndx) => {
    //     console.log(`Ship #${ndx+1}`)
    //     console.log(ship);
    // });

    // userData.user.loans.forEach((loan, ndx) => {
    //     console.log(`Loan #${ndx+1}`)
    //     console.log(loan);
    // });
}

// This helps us take pauses in between function calls so we don't
// over step our 2 call per second limit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let testInfo = {
    playername: 'TestSpaceScorpion21', 
    token: '3317adf1-d73b-4c6c-ac4c-307b60f25574',
    shipId: 'ckmmsyeen29450915s6lnnmyxtk',
    location: 'OE-PM'
}

startScript();