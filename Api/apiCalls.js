const fetch = require("node-fetch");
const baseUrl = "https://api.spacetraders.io/";

/**
 * Creates and formats a GET request to the spacetraders API
 * @param {String} endpoint Anything after the baseUrl to call the API
 * @param {String} token The token associated with the players username. This value should be null if there isn't a token needed for the call.
 * @returns raw data from the API
 */
async function getApiData(endpoint, token){
    let headers = { 'Content-Type': 'application/json' };

    if(token !== null){
        headers.Authorization = `Bearer ${token}`
    }
    
    const res = await fetch(baseUrl + endpoint, {
        method: 'GET',
        headers,
    });

    const data = await res.json();
    return data;
}

/**
 * Creates and formats a POST request to the spacetraders API
 * @param {String} endpoint Anything after the baseUrl to call the API
 * @param {String} token The token associated with the players username. This value should be null if there isn't a token needed for the call.
 * @param {Object} bodyObject A JS object with anything in it
 * @returns raw data from the API
 */
async function postApiData(endpoint, token, bodyObject){
    let headers = { 'Content-Type': 'application/json' };

    if(token !== null){
        headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyObject)
    });

    const data = await res.json();
    return data;
}

// TODO: Needs testing
/**
 * Creates and formats a PUT request to the space traders API
 * @param {String} endpoint 
 * @param {String} token 
 * @param {String} bodyObject 
 * @returns raw data from the API
 */
async function putApiData(endpoint, token, bodyObject){
    const res = await fetch(baseUrl + endpoint, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bodyObject)
    });
    
    const data = await res.json();
    return data;
}

/**
 * Creates and formats a DELETE request to the spacetraders API
 * @param {String} endpoint 
 * @param {String} token 
 * @returns raw data from the API
 */
async function deleteApiData(endpoint, token){
    const res = await fetch(baseUrl + endpoint, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await res.json();
    return data;
}

exports.getApiData = getApiData;
exports.postApiData = postApiData;
exports.putApiData = putApiData;
exports.deleteApiData = deleteApiData;