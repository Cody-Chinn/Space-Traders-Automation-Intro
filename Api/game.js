// https://api.spacetraders.io/#api-game-status
const calls = require('./apiCalls.js');

/**
 * The server status of the game
 * @returns An object with a status key detailing the game system
 */
async function getGameStatus(){
    const gameStatus = await calls.getApiData('game/status', null);
    return gameStatus;
}

exports.getGameStatus = getGameStatus;
