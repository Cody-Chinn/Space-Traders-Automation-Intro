// https://api.spacetraders.io/#api-loans
const calls = require('./apiCalls.js');

/**
 * Get request for https://api.spacetraders.io/game/loans
 * @param {String} token The token associated with the players username
 * @returns A list of available loan objects
 */
async function getAvailableLoans(token){
    const loans = await calls.getApiData(
        `game/loans`, 
        token
    );
    return loans;
}

/**
 * Get request for https://api.spacetraders.io/users/:username/loans
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @returns All of the loans the player currently needs to pay back
 */
async function getCurrentLoans(name, token){
    const loans = await calls.getApiData(
        `users/${name}/loans`, 
        token
    );
    return loans;
}

/**
 * Put request for api.spacetraders.io/users/$username/loans/$loanId
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} loanId The ID of the loan to pay off
 * @returns User object containing all data for the user
 */
async function payoffLoan(name, token, loanId){
    const loan = await calls.putApiData(
        `users/${name}/loans/${loanId}`, 
        token, 
        null
    );
    return loan;
}

/**
 * Post request for api.spacetraders.io/users/$username/loans
 * @param {String} name The players username
 * @param {String} token The token associated with the players username
 * @param {String} type Loan type, either 'STARTUP' or 'ENTERPRISE'
 * @returns User object containing all data for the user
 */
async function requestNewLoan(name, token, type){
    const myLoan = await calls.postApiData(
        `users/${name}/loans`, 
        token, 
        {type}
    );
    return myLoan;
}

exports.getAvailableLoans = getAvailableLoans;
exports.getCurrentLoans = getCurrentLoans;
exports.payoffLoan = payoffLoan;
exports.requestNewLoan = requestNewLoan;