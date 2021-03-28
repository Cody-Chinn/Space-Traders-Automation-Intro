// https://api.spacetraders.io/#api-purchase_orders
const calls = require('./apiCalls');

/**
 * Post request for https://api.spacetraders.io/users/:username/purchase-orders
 * @param {String} name The username of the player
 * @param {String} token The token assocciated with the players username
 * @param {String} shipId The ID of the ship with the goods to sell
 * @param {String} good The good type to sell (All types found in materialTypes.js)
 * @param {Number} quantity The amount of the goods to sell
 * @returns Updated user data and ship data based on the sale
 */
async function placePurchaseOrder(name, token, shipId, good, quantity){
    const newPurchaseOrder = await calls.postApiData(
        `users/${name}/purchase-orders`,
        token,
        {shipId, good, quantity}
    );
    return newPurchaseOrder;
}

exports.placePurchaseOrder = placePurchaseOrder;