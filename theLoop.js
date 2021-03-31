const flightPlans = require('./Api/flightPlans.js');
const purchaseOrder = require('./Api/purchaseOrders.js');
const sellOrders = require('./Api/sellOrders.js');
const materialTypes = require('./Api/materialTypes.js');

/**
 * The meat and potatoes function. All editing should be done here to optimize credit flow.
 * This takes whatever ship you pass it and creates a 4 step pattern
 * 
 * 1.) Buy metal and fly to the Prime from Tritus
 * 2.) 90 seconds later sell the metal on Prime and refuel
 * 3.) Buy some workers and fly back to the moon
 * 4.) Sell the workers and refuel
 * 
 * @param {String} username The players username
 * @param {String} token The token associated with the players username
 * @param {String} shipId The ship to start the loop with
 * @returns {null} If any errors are found, the loop prints the error and stops
 */
async function theLoop(username, token, shipId){

    const delayTimer = 1000;

    console.log('\n\nBEGINNING AUTOMATION LOOP!');
    while(1){
        // STEP ONE ----- BUY METAL AND FLY TO TRITUS -------------------------------------------------------------------------------
        // Buy some METAL goods so we can sell it on another planet, when buying/selling in this loop try to use 
        // the materialTypes.js import. It makes life a lot easier by giving you the options of things to buy
        const metalOrder = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialTypes.types.METALS, 80);
        const metalBuyPrice = metalOrder.order.total;
        if(metalOrder.error){
            console.log('\nERROR BUYING METAL: ');
            console.log('--------------------');
            throw new Error(metalOrder.error.message);
        }
        console.log(`Bought some Metal for ${metalBuyPrice} credits, let\'s go sell it on Prime for profit!`);
        // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
        // To get more info on locations you can use the functions in the locations file 
        const tritusToPrime = await flightPlans.submitNewFlightPlan(username, token, shipId, 'OE-PM');
        if(tritusToPrime.error){
            console.log('\nERROR FLYING FROM TRITUS TO PRIME: ');
            console.log('-----------------------------------');
            throw new Error(tritusToPrime.error.message);
        }
        // It's better to grab the flight time of a flight plan and then multiply by 1000
        // to convert from milliseconds. This makes the script less vulnerable to flight
        // time changes on updates from the SpaceTraders API.
        const tritusToPrimeFlighTime = tritusToPrime.flightPlan.timeRemainingInSeconds;

        console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);

        await sleep(tritusToPrimeFlighTime*1000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP TWO ----- SELL METAL AND REFUEL -------------------------------------------------------------------------------------
        // Sell all of the METAL material on your ship for profit
        const sellMetals = await sellOrders.sellGoods(username, token, shipId, materialTypes.types.METALS, 80);  
        if(sellMetals.error){
            console.log('\nERROR SELLING METAL: ');
            console.log('---------------------');
            throw new Error(sellMetals.error.message);
        }

        const sellMetalsPrice = sellMetals.order.total;
        console.log(`Metal sold for ${sellMetalsPrice} credits!`);
        if(sellMetalsPrice - metalBuyPrice > 0){
            console.log(`That's a profit of ${sellMetalsPrice-metalBuyPrice} credits!`);
        } else {
            console.log(`That's a loss of ${metalBuyPrice-sellMetalsPrice} credits :( You may want to stop the loop to research the market`);
        }

        // Need to buy fuel at every planet to make sure we don't run out
        const refuelOne = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialTypes.types.FUEL, 2);
        if(refuelOne.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            throw new Error(refuelOne.error.message);
        }
        console.log('Ship refueled! Time for a nap.');

        await sleep(delayTimer);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP THREE ----- BUY WORKERS AND FLY BACK TO THE MOON --------------------------------------------------------------------
        // Buy some WORKERS goods so we can sell it on another planet
        const workerOrder = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialTypes.types.WORKERS, 40);
        const workerBuyPrice = workerOrder.order.total;
        if(workerOrder.error){
            console.log('\nERROR BUYING WORKERS: ');
            console.log('----------------------');
            throw new Error(workerOrder.error.message);
        }
        console.log(`Bought some Workers for ${workerBuyPrice} credits, time to sell them on the moon!`);
        
        // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
        // To get more info on locations you can use the functions in the locations file 
        const primeToTritus = await flightPlans.submitNewFlightPlan(username, token, shipId, 'OE-PM-TR');
        if(primeToTritus.error){
            console.log('\nERROR FLYING FROM PRIME TO TRITUS: ');
            console.log('-----------------------------------');
            throw new Error(primeToTritus.error.message);
        }
        // Still need to make sure we using retrieved flight times, not hardcoded numbers
        const primteToTritusFlightTime = primeToTritus.flightPlan.timeRemainingInSeconds;

        console.log(`Ship has liftoff, waiting 90 seconds until touchdown`);

        await sleep(primteToTritusFlightTime*1000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP FOUR ------ SELL WORKERS AND REFUEL ---------------------------------------------------------------------------------
        // Sell all of the METAL material on your ship for profit
        const sellWorkers = await sellOrders.sellGoods(username, token, shipId, materialTypes.types.WORKERS, 40);
        const workerSellPrice = sellWorkers.order.total;
        if(sellWorkers.error){
            console.log('\nERROR SELLING WORKERS: ');
            console.log('---------------------');
            throw new Error(sellOrder.error.message);
        }
        console.log(`Workers sold for ${workerSellPrice} credits!`);
        if(workerSellPrice-workerBuyPrice > 0){
            console.log(`That's a profit of ${workerSellPrice-workerBuyPrice} credits!`);
        } else {
            console.log(`That's a loss of ${workerBuyPrice-workerSellPrice} credits :( You may want to stop the loop to research the market`);
        }

        // Refuel again - this time we need to buy more because it takes more fuel to go from Prime to Tritus than Tritus to Prime
        const refuelTwo = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialTypes.types.FUEL, 4);
        if(refuelTwo.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            throw new Error(refuelTwo.error.message);
        }
        console.log('Ship refueled! Time for a nap.\n\nStarting next iteration!');

        await sleep(delayTimer);
        // RESTART THE LOOP ----------------------------------------------------------------------------------------------------------
    }
}

/**
 * Pause the script for a number of milliseconds (seconds * 1000)
 * @param {Number} ms The time in milliseconds we want the script to pause for
 * @returns {Promise} returning a promise allows us to pause using the await keyword
 */
 function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.theLoop = theLoop;