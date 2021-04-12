const ships = require('../Api/ships');
const flightPlans = require('../Api/flightPlans.js');
const purchaseOrder = require('../Api/purchaseOrders.js');
const sellOrders = require('../Api/sellOrders.js');
const prep = require('./preflightPrep');
const help = require('../Misc/helpers.js');
const {systems} = require('../Api/locationNames.js');
const {materials} = require('../Api/materialTypes.js');

/**
 * The meat and potatoes function. All editing should be done here to optimize credit flow.
 * This takes whatever ship you pass it and creates a 4 step pattern
 * 
 * 0.) preflight checks and calculations - set materials here
 * 1.) Buy the first material and fly to the Prime from Tritus
 * 2.) once the ship lands sell the first material on Prime and refuel
 * 3.) Buy some material two and fly back to the moon
 * 4.) Sell material two and refuel
 * 
 * @param {String} username The players username
 * @param {String} token The token associated with the players username
 * @param {String} shipId The ship to start the loop with
 * @returns {Error} If any errors are found, the loop prints the error and stops
 */
async function theLoop(username, token, shipId){
    const delayTimer = 1000;
    await help.sleep(delayTimer);

    // Configure locations for the loop
    const locationOne = systems.OE.PMTR;
    const locationTwo = systems.OE.PM;

    // Make sure the ship is capable of running the loop before we try to start the loop
    const readyShip = await prep.preflightCheck(username, token, shipId, locationOne);
    if(!readyShip){
        console.log(`The ship with ID ${shipId}, failed pre flight checks. 2 things are needed to make sure the ship is ready for the loop`);
        console.log(`1.) Ship needs to be on the moon.`);
        console.log(`2.) Ship can only have enough fuel to make it to Prime in cargo. Nothing else.`);
        throw new Error(`Exiting automation`);
    } else {
        console.log('Ship has been prepped for the loop!')
    }

    // The two materials to be bought and sold in the loop
    // Material One will be bought on the first planet and sold on the second
    // Material Two will be bought on the second planet and sold on the first
    const materialOne = materials.METALS;
    const materialTwo = materials.DRONES;

    await help.sleep(delayTimer);

    // We need to update the ship data since the preflight checks modified the data in loopship
    const preppedShip = await ships.getShipInfoById(username, token, shipId);

    // Calculate how much of material one and two to buy
    const matOneSize = await help.getMaterialSize(token, locationOne, materialOne);
    const matOneAmount = Math.floor(preppedShip.ship.spaceAvailable / matOneSize);

    console.log('\n\nBEGINNING AUTOMATION LOOP!');
    while(1){
        await help.sleep(delayTimer);
        // STEP ONE ----- BUY FIRST MATERIAL AND FLY TO SECOND LOCATION ------------------------------------------------------------------
        // Buy the first material so we can sell it on another planet, when buying/selling in this loop try to use 
        // the materialTypes.js import. It makes life a lot easier by giving you the options of things to buy
        const orderMaterialOne = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialOne, matOneAmount);
        if(orderMaterialOne.error){
            console.log(`\nERROR BUYING ${materialOne}: `);
            console.log('--------------------');
            throw new Error(orderMaterialOne.error.message);
        }
        const buyMatOnePrice = orderMaterialOne.order.total;
        console.log(`Bought some ${materialOne} for ${buyMatOnePrice} credits, let\'s go sell it on Prime for profit!`);
        // Send the ship to the location two configured at the top of the file
        // To get more info on locations you can use the functions in the locations file 
        const oneToTwo = await flightPlans.submitNewFlightPlan(username, token, shipId, locationTwo);
        if(oneToTwo.error){
            console.log('\nERROR FLYING FROM TRITUS TO PRIME: ');
            console.log('-----------------------------------');
            throw new Error(oneToTwo.error.message);
        }
        // It's better to grab the flight time of a flight plan then multiply by 1000
        // to convert from milliseconds. This makes the script less vulnerable to flight
        // time changes on updates from the SpaceTraders API.
        const oneToTwoFlighTime = oneToTwo.flightPlan.timeRemainingInSeconds;

        console.log(`Ship has liftoff, waiting ${oneToTwoFlighTime} seconds until touchdown`);

        await help.sleep(oneToTwoFlighTime*1000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP TWO ----- SELL FIRST MATERIAL AND REFUEL ----------------------------------------------------------------------------
        // Sell all of the first material on your ship for profit
        const sellMatOne = await sellOrders.sellGoods(username, token, shipId, materialOne, matOneAmount);  
        if(sellMatOne.error){
            console.log(`\nERROR SELLING ${materialOne}: `);
            console.log('---------------------');
            throw new Error(sellMatOne.error.message);
        }

        const sellMatOnePrice = sellMatOne.order.total;
        const matOneDifference = sellMatOnePrice - buyMatOnePrice;
        console.log(`${materialOne} sold for ${sellMatOnePrice} credits!`);
        if(matOneDifference > 0){
            console.log(`That's a profit of ${matOneDifference} credits!`);
        } else {
            console.log(`That's a loss of ${matOneDifference*-1} credits :( You may want to stop the loop to research the market`);
        }

        // Need to buy fuel at every planet to make sure we don't run out
        const refuelOne = await purchaseOrder.placePurchaseOrder(username, token, shipId, materials.FUEL, 2);
        if(refuelOne.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            throw new Error(refuelOne.error.message);
        }
        console.log('Ship refueled! Time for a nap.');

        await help.sleep(delayTimer);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP THREE ----- BUY SECOND MATERIAL AND FLY BACK TO LOCATION ONE --------------------------------------------------------
        // Buy second material so we can sell it on another planet
        const matTwoSize = await help.getMaterialSize(token, locationTwo, materialTwo);
        const matTwoAmount = Math.floor(preppedShip.ship.spaceAvailable / matTwoSize);
        await help.sleep(delayTimer);

        const materialTwoOrder = await purchaseOrder.placePurchaseOrder(username, token, shipId, materialTwo, matTwoAmount);
        if(materialTwoOrder.error){
            console.log(`\nERROR BUYING ${materialTwo}: `);
            console.log('----------------------');
            throw new Error(materialTwoOrder.error.message);
        }
        const matTwoBuyPrice = materialTwoOrder.order.total;
        console.log(`Bought some ${materialTwo} for ${matTwoBuyPrice} credits, time to sell them on the moon!`);
        
        // Send the ship to the nearest planet (in this case OE-PM since we're on OE-PM-TR)
        // To get more info on locations you can use the functions in the locations file 
        const twoToOne = await flightPlans.submitNewFlightPlan(username, token, shipId, locationOne);
        if(twoToOne.error){
            console.log('\nERROR FLYING FROM PRIME TO TRITUS: ');
            console.log('-----------------------------------');
            throw new Error(twoToOne.error.message);
        }
        // Still need to make sure we using retrieved flight times, not hardcoded numbers
        const twoToOneFlightTime = twoToOne.flightPlan.timeRemainingInSeconds;

        console.log(`Ship has liftoff, waiting ${twoToOneFlightTime} seconds until touchdown`);

        await help.sleep(twoToOneFlightTime*1000);
        // --------------------------------------------------------------------------------------------------------------------------



        // STEP FOUR ------ SELL MATERIAL TWO AND REFUEL ----------------------------------------------------------------------------
        // Sell all of the second material on your ship for profit
        const sellMaterialTwo = await sellOrders.sellGoods(username, token, shipId, materialTwo, matTwoAmount);
        if(sellMaterialTwo.error){
            console.log(`\nERROR SELLING ${materialTwo}: `);
            console.log('---------------------');
            throw new Error(sellMaterialTwo.error.message);
        }
        const matTwoSellPrice = sellMaterialTwo.order.total;
        const matTwoDifference = matTwoSellPrice-matTwoBuyPrice;
        console.log(`${materialTwo} sold for ${matTwoSellPrice} credits!`);
        if(matTwoDifference > 0){
            console.log(`That's a profit of ${matTwoDifference} credits!`);
        } else {
            console.log(`That's a loss of ${matTwoDifference*-1} credits :( You may want to stop the loop to research the market`);
        }

        // Refuel again - this time we need to buy more because it takes more fuel to go from Prime to Tritus than Tritus to Prime
        const refuelTwo = await purchaseOrder.placePurchaseOrder(username, token, shipId, materials.FUEL, 4);
        if(refuelTwo.error){
            console.log('\nERROR BUYING FUEL: ');
            console.log('-------------------');
            throw new Error(refuelTwo.error.message);
        }
        // Update the player on their credits and stop the loop if it's no longer profitable to run
        console.log(`Ship refueled. You now have ${refuelTwo.credits} credits!`);
        if(matOneDifference + matTwoDifference > 0){
            console.log(`Thats a profit of ${matOneDifference+matTwoDifference}. Good Work!`);
        } else {
            console.log(`That's a loss of ${(matOneDifference+matTwoDifference)*-1}. Let's stop the loop to prevent further loss.`);
            throw new Error(`Automation Loop is taking losses. Modify the loop to be profitable!`);
        }
        console.log(`Getting ready to start the next loop.\n\n`)
        await help.sleep(delayTimer);
        // RESTART THE LOOP ----------------------------------------------------------------------------------------------------------
    }
}

exports.theLoop = theLoop;