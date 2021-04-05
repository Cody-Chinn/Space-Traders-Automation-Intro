const locationNames = require('./Api/locationNames.js');
const locations = require('./Api/locations.js');
const materials = require('./Api/materialTypes.js');
const flights = require('./Api/flightPlans.js');
const purchase = require('./Api/purchaseOrders.js');
const sell = require('./Api/sellOrders.js');
const ships = require('./API/ships.js');
const help = require('./helpers.js');

const delayTimer = 1000;
/**
 * Helps determine whether a ship is ready to start the loop by doing
 * 3 different checks
 * 1) Sell everything. We need a blank slate to work with
 * 2) Is the ship on the moon? Send it there if not
 * 3) Is there enough fuel to make it to prime? Fuel up is not.
 * @param {Object} ship The ship retrieved from the getShipById endpoint
 * @return {Boolean} whether or not the ship passed preflight check
 */
 async function preflightCheck(username, token, ship){

    console.log('\n\nRunning pre-flight checks!');
    console.log('Clearing out space in the ship...');
    // 1: SELL EVERYTHING! (Or jettison it... either way the ship needs to be empty)
    if(ship.ship.cargo.length !== 0){
        await emptyShip(username, token, ship.ship.id);
    }
    console.log('Ship has been emptied. Preflight cargo test: PASS');

    // 2: TO THE MOON 🚀
    if(ship.ship.location === locationNames.systems.OE.PMTR){
        console.log('Ship is already on the moon. Preflight location test: PASS');
    } else {
        const travelTime = await sendToMoon(username, token, ship);
        await help.sleep(travelTime*1000);
        console.log('Ship is on the moon. Preflight location test: PASS');
    }  
    
    // 3: FUEL UP FOR THE LOOP!
    // I generally like keeping 10 fuel in the ship. It's not quite as optimized but
    // I feel safer with extra gas
    const cargoUpdate = await ships.getShipInfoById(username, token, ship.ship.id);
    let fuelAmount = 0;
    cargoUpdate.ship.cargo.forEach(item => {
        if(item.good === "FUEL"){
            fuelAmount = item.quantity;
        }
    });

    if(fuelAmount >= 10){
        console.log(`Fuel is at ${fuelAmount}. Preflight fuel test: PASS`);
    } else {
        const neededFuel = 10-fuelAmount;
        const buyFuel = await purchase.placePurchaseOrder(username, token, ship.ship.id, materials.types.FUEL, neededFuel);
        if(buyFuel.error){
            console.log(`Couldn't buy fuel to send the ship to the moon in preflight check`);
            throw new Error(buyFuel.error.message);
        }
        console.log(`Bought Fuel. Preflight fuel test: PASS`);
        await help.sleep(delayTimer);
    }

    return true;
}

/**
 * Send a ship to the moon from any location
 * @param {String} username The players username
 * @param {String} token The token associated with the players username
 * @param {Object} ship The ship retrieved from the getShipById endpoint
 * @returns {Number} Flight time in seconds to the moon
 */
async function sendToMoon(username, token, ship){
    await help.sleep(delayTimer);
    const moon = await locations.getLocationInfo(token, locationNames.systems.OE.PMTR);
    const moonDistance = await help.calcDistance(ship.ship.x, ship.ship.y, moon.location.x, moon.location.y);
    
    // Ship fuel amount should be at 0, so buying fuel to get to the moon shouldn't cause problems
    // We also waant to buy just a little more than the distance to make sure we get there without problems
    const buyFuel = await purchase.placePurchaseOrder(username, token, ship.ship.id, materials.types.FUEL, moonDistance+1);
    if(buyFuel.error){
        console.log(`Couldn't buy fuel to send the ship to the moon in preflight check`);
        throw new Error(buyFuel.error.message);
    }

    await help.sleep(delayTimer);
    const flyToMoon = await flights.submitNewFlightPlan(username, token, ship.ship.id, locationNames.systems.OE.PMTR);
    if(flyToMoon.error){
        console.log('Could not send the ship to the moon in preflight check :/ ');
        throw new Error(flyToMoon.error.message)
    }
    console.log(`Flying to the moon! This should take about ${flyToMoon.flightPlan.timeRemainingInSeconds} seconds`);
    await help.sleep(flyToMoon.flightPlan.timeRemainingInSeconds);

    return flyToMoon.flightPlan.timeRemainingInSeconds;
}

/**
 * Get rid of everything on the ship
 * @param {String} username The players username
 * @param {String} token The token associate with the players username
 * @param {Object} ship The ship retrieved by the getShipById endpoint
 */
async function emptyShip(username, token, shipId){
    await help.sleep(1000);
    const shipData = await ships.getShipInfoById(username, token, shipId);
    for(let i = 0; i < shipData.ship.cargo.length; i++){
        await help.sleep(1000);
        const sold = await sell.sellGoods(username, token, shipId, shipData.ship.cargo[i].good, shipData.ship.cargo[i].quantity);
        if(sold.error){
            console.log(`There was an error selling ${shipData.ship.cargo[i].good}, so we'll just try to throw it out`);        
            console.log(sold.error.message);
            const trash = await ships.jettisonCargo(username, token, shipId, shipData.ship.cargo[i].good, shipData.ship.cargo[i].quantity);
            if(trash.error){
                console.log(`There was an issue emptying the ship in the preflight check`);
                throw new Error(jettison.error.message);
            } else {
                console.log(`Succesfully jettisoned ${shipData.ship.cargo[i].good}!`);
            }
        } else {
            console.log(`Sold ${shipData.ship.cargo[i].good}!`);
        }
    }
    await help.sleep(1000);
}

exports.preflightCheck = preflightCheck;
exports.emptyShip = emptyShip;