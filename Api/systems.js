// https://api.spacetraders.io/#api-systems
const calls = require('./apiCalls.js');

/**
 * Get request for https://api.spacetraders.io/game/systems
 * @param {String} token The token associated with the players username
 * @returns An object containing a list of systems and their locations
 */
async function getSystemInfo(token){
    const sysInfo = await calls.getApiData(`game/systems`, token);
    return sysInfo;
}

exports.getSystemInfo = getSystemInfo;