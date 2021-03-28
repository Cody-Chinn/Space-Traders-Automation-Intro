const prompt = require('prompt-sync')();
const flightPlans = require('./Api/flightPlans.js');
const loans = require('./Api/loans.js');
const purchaseOrder = require('./Api/purchaseOrders.js');
const sellOrders = require('./Api/sellOrders.js');
const ships = require('./Api/ships.js');
const users = require('./Api/users.js');

async function startScript(){

    // // Each call made to the api has a flow of index.js -> Api/{endpoint}.js -> apiCall.js
    // // This is to cut down on the amount of copy/pasted code in each file so each file used 
    // // in the index will need to be required at the top in order to use the functions (ie users.createNewUser below)
    // const playerNamePrompt = prompt('Welcome Space Cadet! What\'s your callsign? ');
    // const playerName = await users.createNewUser(playerNamePrompt);

    // // Lets get make sure the username isn't taken first and display an error message if 
    // // there was one present on the returned json. These checks are placed throughout the
    // // loop to make sure each call works as expected
    // if(playerName.error){
    //     console.log('\nERROR CREATING USER: ');
    //     console.log('---------------------');
    //     console.log(playerName.error.message);
    //     return;
    // }



    // // Kickoff the automation and notify the user of their token
    // console.log(`\n\nHello ${playerName.user.username}, beginning your automation now!`);
    // console.log(`You'll want to save this token. It's pretty important --> ${playerName.token}`);
    
    // // Take out a loan so we can purchase a ship
    // const loan = await loans.requestNewLoan(playerName.user.username, playerName.token, 'STARTUP');
    // if(loan.error){
    //     console.log('\nERROR TAKING OUT LOAN: ');
    //     console.log('-----------------------');
    //     console.log(loan.error.message);
    //     return;
    // }

    // console.log(`Loan received! Here's the ID: ${loan.user.loans[0].id}. You'll need that to pay it back.`)
    // // The api has a 2 call per second limit so we need to sleep long enough
    // // to be to make calls again. You'll see more of these throughout the script
    // await sleep(1500);


    
    // // Buy a ship and grab the Id for future functions
    // const meNewShip = await ships.buyShip(playerName.user.username, playerName.token, 'OE-PM-TR', 'JW-MK-I');
    // if(meNewShip.error){
    //     console.log('\nERROR BUYING SHIP: ');
    //     console.log('-------------------');
    //     console.log(meNewShip.error.message);
    //     return;
    // }
    // const meNewShipId = meNewShip.user.ships[0].id;

    // console.log(`Ship purchased! Here's the ID: ${meNewShip}`);
    // // Purchase Fuel for the newly aquired ship
    // const initialFuelOrder = await purchaseOrder.placePurchaseOrder(playerName.user.username, playerName.token, meNewShipId, 'FUEL', 20);
    // if(initialFuelOrder.error){
    //     console.log('\nERROR BUYING FUEL: ');
    //     console.log('-------------------');
    //     console.log(initialFuelOrder.error.message);
    //     return;
    // }
    // console.log(`Fueled up, lets get some cargo after a 1.5 second nap`);
    // await sleep(1500);

    const playerName = {
        user: {
            username: 'SpaceScorpion'
        },
        token: 'b2cea63f-4de5-4f17-a073-ae8ddcfeec15'
    }

    const meNewShip = await ships.getPlayersShips(playerName.user.username, playerName.token);
    const meNewShipId = meNewShip.ships[0].id;

    // THE LOOP
    console.log('\n\nBEGINNING AUTOMATION LOOP!');
    while(1){
        // STEP ONE ----- BUY METAL AND FLY TO TRITUS -------------------------------------------------------------------------------
        // Buy some METAL goods so we can sell it on another planet
        const metalOrder = await purchaseOrder.placePurchaseOrder(playerName.user.username, playerName.token, meNewShipId, 'METALS', 80);
        const metalBuyPrice = metalOrder.order.total;
        if(metalOrder.error){
            console.log('\nERROR BUYING METAL: ');
            console.log('--------------------');
            console.log(metalOrder.error.message);
            return;
        }
        console.log(`Bought some Metal for ${metalBuyPrice} credits, let\'s go sell it on Prime for profit!`);
        // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
        // To get more info on locations you can use the functions in the locations file 
        const tritusToPrime = await flightPlans.submitNewFlightPlan(playerName.user.username, playerName.token, meNewShipId, 'OE-PM');
        if(tritusToPrime.error){
            console.log('\nERROR FLYING FROM TRITUS TO PRIME: ');
            console.log('-----------------------------------');
            console.log(tritusToPrime.error.message);
            return;
        }

        console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);

        await sleep(90000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP TWO ----- SELL METAL AND REFUEL -------------------------------------------------------------------------------------
        // Sell all of the METAL material on your ship for profit
        const sellMetals = await sellOrders.sellGoods(playerName.user.username, playerName.token, meNewShipId, 'METALS', 80);
        const sellMetalsPrice = sellMetals.order.total;
        if(sellMetals.error){
            console.log('\nERROR SELLING METAL: ');
            console.log('---------------------');
            console.log(sellMetals.error.message);
            return;
        }
        console.log(`Metal sold for ${sellMetalsPrice} credits!`);
        if(sellMetalsPrice - metalBuyPrice > 0){
            console.log(`That's a profit of ${sellMetalsPrice-metalBuyPrice} credits!`);
        } else {
            console.log(`That's a loss of ${metalBuyPrice-sellMetalsPrice} credits :( You may want to stop the loop to research the market`);
        }

        // Need to buy fuel at every planet to make sure we don't run out
        const refuelOne = await purchaseOrder.placePurchaseOrder(playerName.user.username, playerName.token, meNewShipId, 'FUEL', 2);
        if(refuelOne.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            console.log(refuelOne.error.message);
            return;
        }
        console.log('Ship refueled! Time for a nap.');

        await sleep(1500);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP THREE ----- BUY WORKERS AND FLY BACK TO THE MOON --------------------------------------------------------------------
        // Buy some WORKERS goods so we can sell it on another planet
        const workerOrder = await purchaseOrder.placePurchaseOrder(playerName.user.username, playerName.token, meNewShipId, 'WORKERS', 40);
        const workerBuyPrice = workerOrder.order.total;
        if(workerOrder.error){
            console.log('\nERROR BUYING WORKERS: ');
            console.log('----------------------');
            console.log(workerOrder.error.message);
            return;
        }
        console.log(`Bought some Workers for ${workerBuyPrice} credits, time to sell them on the moon!`);
        
        // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
        // To get more info on locations you can use the functions in the locations file 
        const primeToTritus = await flightPlans.submitNewFlightPlan(playerName.user.username, playerName.token, meNewShipId, 'OE-PM-TR');
        if(primeToTritus.error){
            console.log('\nERROR FLYING FROM PRIME TO TRITUS: ');
            console.log('-----------------------------------');
            console.log(primeToTritus.error.message);
            return;
        }
        console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);

        await sleep(90000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP FOUR ------ SELL WORKERS AND REFUEL ---------------------------------------------------------------------------------
        // Sell all of the METAL material on your ship for profit
        const sellWorkers = await sellOrders.sellGoods(playerName.user.username, playerName.token, meNewShipId, 'WORKERS', 40);
        const workerSellPrice = sellWorkers.order.total;
        if(sellWorkers.error){
            console.log('\nERROR SELLING WORKERS: ');
            console.log('---------------------');
            console.log(sellOrder.error.message);
            return;
        }
        console.log(`Workers sold for ${workerSellPrice} credits!`);
        if(workerSellPrice-workerBuyPrice > 0){
            console.log(`That's a profit of ${workerSellPrice-workerBuyPrice} credits!`);
        } else {
            console.log(`That's a loss of ${workerBuyPrice-workerSellPrice} credits :( You may want to stop the loop to research the market`);
        }

        // Refuel again - this time we need to buy more because it takes more fuel to go from Prime to Tritus than Tritus to Prime
        const refuelTwo = await purchaseOrder.placePurchaseOrder(playerName.user.username, playerName.token, meNewShipId, 'FUEL', 4);
        if(refuelTwo.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            console.log(refuelTwo.error.message);
            return;
        }
        console.log('Ship refueled! Time for a nap.\n\nStarting next iteration!');

        await sleep(1500);
        // RESTART THE LOOP ----------------------------------------------------------------------------------------------------------
    }    
}

// This helps us take pauses in between function calls so we don't
// over step our 2 call per second limit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

startScript();