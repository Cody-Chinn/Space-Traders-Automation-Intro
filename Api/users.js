// https://api.spacetraders.io/#api-users
const calls = require('./apiCalls.js');

/**
 * Post request for https://api.spacetraders.io/users/:username/token
 * @param {String} name The desired username
 * @returns The created data for the new user
 */
async function createNewUser(name){
    const newUser = await calls.postApiData(`users/${name}/token`);
    return newUser;
}

/**
 * Get request for https://api.spacetraders.io/users/:username
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @returns An object of all of the users info in game
 */
async function getUserInfo(name, token){
    const userInfo = await calls.getApiData(`users/${name}`, token);
    return userInfo;
}

exports.createNewUser = createNewUser;
exports.getUserInfo = getUserInfo;
