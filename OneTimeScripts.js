/**
 * Think of this as a playground area for node. You can run this file with
 * 'npm test'. I've left a few functions in this file that I frequently
 * use when I'm either researching the market or trying to pull ID's from
 * ships or loans
 */

const preflight = require('./preflightPrep.js');
const ships = require('./Api/ships.js');
const mats = require('./Api/materialTypes.js')
const { placePurchaseOrder } = require('./Api/purchaseOrders.js');

const username = 'SpaceScorpion';
const token = '60a782be-02f2-4716-9600-20d8a3feb254';

async function preflightCheck(){
    const ship = await ships.getShipInfoById(username, token,'ckmwqlurt6791031cs6nrbunn5i');
    const preFlightTestPass = await preflight.preflightCheck(username, token, ship);
    
    if(preFlightTestPass){
        console.log('Preflight Test: PASS');
    } else {
        console.log('Preflight Test: FAIL');
    }
}
// preflightCheck();

async function testEmptyShip(){
    const ship = await ships.getShipInfoById(username, token,'ckn0lsl406542331bs67o69p0id');
    await sleep(1000);
    const buyStuff1 = await placePurchaseOrder(username, token, ship.ship.id, mats.types.METALS, 1);
    await sleep(1000);
    const buyStuff2 = await placePurchaseOrder(username, token, ship.ship.id, mats.types.FUEL, 1);
    if(buyStuff1.error){
        console.log(buyStuff1.error.message);
        return;
    }
    if(buyStuff2.error){
        console.log(buyStuff2.error.message);
        return;
    }
    await sleep(5000);
    await preflight.emptyShip(username, token, ship.ship.id);
    console.log('finished emptying ship!');
}
// testEmptyShip();

async function getShipList(){
    const shipList = await ships.getPlayersShips(username, token);
    console.log('Ship List: ');
    console.log(shipList);
}
getShipList();

/**
 * Pause the script for a number of milliseconds (seconds * 1000)
 * @param {Number} ms The time in milliseconds we want the script to pause for
 * @returns {Promise} returning a promise allows us to pause using the await keyword
 */
 function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}