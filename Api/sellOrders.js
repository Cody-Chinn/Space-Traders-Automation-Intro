// https://api.spacetraders.io/#api-sell_orders
const calls = require('./apiCalls');

/**
 * Post request for https://api.spacetraders.io/users/:username/sell-orders
 * @param {String} name The username of the player
 * @param {String} token The token assocciated with the players username
 * @param {String} shipId The ID of the ship with the goods to sell
 * @param {String} good The good type to sell (IE MACHINERY, ELECTRONICS)
 * @param {Number} quantity The amount of the goods to sell
 * @returns Updated user data and ship data based on the sale
 */
async function sellGoods(name, token, shipId, good, quantity){
    const newPurchaseOrder = await calls.postApiData(
        `users/${name}/sell-orders`,
        token,
        {shipId, good, quantity}
    );
    return newPurchaseOrder;
}

exports.sellGoods = sellGoods;