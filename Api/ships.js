// https://api.spacetraders.io/#api-ships
const calls = require('./apiCalls.js');

/**
 * Post request for api.spacetraders.io/users/$username/ships
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} location The planet symbol to buy the ship on
 * @param {String} type The type of ship to buy (IE JW-MK-I)
 * @returns An object containing updated user data of credits and ship info
 */
async function buyShip(name, token, location, type){
    const newShip = await calls.postApiData(
        `users/${name}/ships`, 
        token, 
        {location, type}
    );
    return newShip;
}

/**
 * Get request for https://api.spacetraders.io/game/ships
 * @param {String} token The token associated with the players username
 */
async function getAvailableShips(token){
    const availableShips = await calls.getApiData(`game/ships`, token);
    return availableShips;
}

/**
 * Get request for https://api.spacetraders.io/users/:username/ships/:shipId
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} shipId The id of the ship to get data on
 * @returns Data on the requested ship
 */
async function getShipInfoById(name, token, shipId){
    const myShip = await calls.getApiData(
        `users/${name}/ships/${shipId}`, 
        token
    );
    return myShip;
}

/**
 * Get request for https://api.spacetraders.io/users/:username/ships
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @returns An object with a list of the players ships
 */
async function getPlayersShips(name, token){
    const myFleet = await calls.getApiData(`users/${name}/ships`, token);
    return myFleet;
}

/**
 * Put request for https://api.spacetraders.io/users/:username/ships/:shipId/jettison
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} shipId The id of the ship to remove cargo from
 * @param {String} good The good to remove from the ship (IE MACHINERY, ELECTRONICS)
 * @param {Number} quantity The amount of good to throw overboard
 * @returns An object with the good, quantity remaining and shipId
 */
async function jettisonCargo(name, token, shipId, good, quantity){
    const bostonTeaPartyThatIsh = await calls.putApiData(
        `users/${name}/ships/${shipId}/jettison`, 
        token, 
        {good, quantity}
    );
    return bostonTeaPartyThatIsh;
}

/**
 * Delete request for https://api.spacetraders.io/users/:username/ships/:shipId/
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} shipId The id of the ship to blow up for money
 * @returns An object with new user data of credits and ships
 */
async function scrapShip(name, token, shipId){
    const blowItUp = await calls.deleteApiData(`users/${name}/ships/${shipId}/`, token);
    return blowItUp;
}

exports.buyShip = buyShip;
exports.getAvailableShips = getAvailableShips;
exports.getShipInfoById = getShipInfoById;
exports.getPlayersShips = getPlayersShips;
exports.jettisonCargo = jettisonCargo;
exports.scrapShip = scrapShip;