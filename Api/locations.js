// https://api.spacetraders.io/#api-locations
const calls = require('./apiCalls.js');

/**
 * Get request for https://api.spacetraders.io/game/locations/:symbol
 * @param {String} token The token associated with the players username
 * @param {String} symbol The planet symbol the data is needed for
 * @returns Object with all related data to the location and player
 */
async function getLocationInfo(token, symbol){
    const location = await calls.getApiData(`game/locations/${symbol}`, token);
    return location;
}

/**
 * Get request for https://api.spacetraders.io/game/locations/:symbol/ships
 * @param {String} token The token associated with the players username
 * @param {String} symbol The planet symbol the data is needed for
 * @returns Object with location data and all data on the players ships at that planet
 */
async function getDockedShipsInfo(token, symbol){
    const location = await calls.getApiData(
        `game/locations/${symbol}/ships`, 
        token
    );
    return location;
}

/**
 * Get request for https://api.spacetraders.io/game/systems/:symbol/locations
 * @param {String} token The token associated with the players username
 * @param {String} symbol The symbol of the system the locations are needed for
 * @returns An object with a location list
 */
async function getLocationsInSystem(token, symbol){
    const locations = await calls.getApiData(
        `game/systems/${symbol}/locations`, 
        token
    );
    return locations;
}

exports.getLocationInfo = getLocationInfo;
exports.getDockedShipsInfo = getDockedShipsInfo;
exports.getLocationsInSystem = getLocationsInSystem;