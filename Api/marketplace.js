// https://api.spacetraders.io/#api-marketplace
const calls = require('./apiCalls.js');

/**
 * Get request for https://api.spacetraders.io/game/locations/:symbol/marketplace
 * @param {String} token 
 * @param {String} symbol The symbol of the planet to get the info on
 * @returns An object with all marketplace info on the given location
 */
async function getMarketInfo(token, symbol){
    const marketInfo = await calls.getApiData(
        `game/locations/${symbol}/marketplace`, 
        token
    );
    return marketInfo;
}

exports.getMarketInfo = getMarketInfo;