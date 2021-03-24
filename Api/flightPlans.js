// https://api.spacetraders.io/#api-flight_plans
const calls = require('./apiCalls.js');

/**
 * Get request for https://api.spacetraders.io/game/systems/:symbol/flight-plans
 * @param {String} token Token associated with the players username
 * @param {String} symbol Symbol of the system you want to get flight plans for
 * @returns List of all flight plan objects, including other players ship
 */
async function getFlightPlansInSystem(token, symbol){
    const flightPlans = await calls.getApiData(
        `game/systems/${symbol}/flight-plans`, 
        token
    );
    return flightPlans;
}

/**
 * Get request for https://api.spacetraders.io/users/:username/flight-plans/:flightPlanId
 * @param {String} name Players username
 * @param {String} token Token associated with the players username
 * @param {String} flightPlanId The ID of the flight plan you want info on
 * @returns A single flight plan object
 */
async function getFlightPlanById(name, token, flightPlanId){
    const flightPlans = await calls.getApiData(
        `users/${name}/flight-plans/${flightPlanId}`, 
        token
    );
    return flightPlans;
}

/**
 * Post request for https://api.spacetraders.io/users/:username/flight-plans
 * @param {String} name Players username
 * @param {String} token Token associated with the players username
 * @param {String} shipId ID of the ship you want to send out
 * @param {String} destination Symbol of the location you want to send the ship
 */
async function submitNewFlightPlan(name, token, shipId, destination){
    bodyObj = {
        shipId,
        destination
    }
    const newFlightPlan = await calls.postApiData(
        `users/${name}/flight-plans`, 
        token, 
        bodyObj
    );
    return newFlightPlan;
}

exports.getFlightPlansInSystem = getFlightPlansInSystem;
exports.getFlightPlanById = getFlightPlanById;
exports.submitNewFlightPlan = submitNewFlightPlan;