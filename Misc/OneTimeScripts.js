/**
 * Think of this as a playground area for node. You can run this file with
 * 'npm test'. I've left a few functions in this file that I frequently
 * use when I'm either researching the market or trying to pull ID's from
 * ships or loans
 */

const preflight = require('../Start Scripts/preflightPrep.js');
const ships = require('../Api/ships.js');
const {materials} = require('../Api/materialTypes.js');
const help = require('./helpers.js');
const { placePurchaseOrder } = require('../Api/purchaseOrders.js');

const username = 'TestScorpion';
const token = '2520618b-e464-4a28-91f7-8ef5e6f50017';

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
    await help.sleep(1000);
    const buyStuff1 = await placePurchaseOrder(username, token, ship.ship.id, materials.METALS, 1);
    await help.sleep(1000);
    const buyStuff2 = await placePurchaseOrder(username, token, ship.ship.id, materials.FUEL, 1);
    if(buyStuff1.error){
        console.log(buyStuff1.error.message);
        return;
    }
    if(buyStuff2.error){
        console.log(buyStuff2.error.message);
        return;
    }
    await help.sleep(5000);
    await preflight.emptyShip(username, token, ship.ship.id);
    console.log('finished emptying ship!');
}
// testEmptyShip();

async function getShipList(){
    const shipList = await ships.getPlayersShips(username, token);
    console.log('Ship List: ');
    console.log(shipList);
}
// getShipList();

async function getSingleShip(){
    const ship = await ships.getShipInfoById(username, token, 'ckn4mp5s910736221ds6cyn6jmtg');
    console.log(ship);
}
// getSingleShip();