const prompt = require('prompt-sync')();
const newAccount = require('./newAccount.js');
const loop = require('./theLoop.js');

/*******************************************************************************
 * This kicks off the player creation and login. This file should be left alone.
 * All editing for this project should take place in theLoop.js
 ******************************************************************************/
async function startScript(){

    let playerInfo;

    // Very first thing, ask the player if they are new
    if(newPlayerPrompt()){
        // The player is new, lets run the account creator from the newAccount.js file
        playerInfo = await newAccount.accountCreator();
        loop.theLoop(playerInfo.username, playerInfo.token, playerInfo.shipId);
    } else {
        console.log(`Unfortunately running loops for existing users hasn't been setup yet but it is on the TODO list!`);
        return;
    }
}

/******************************************************************
 * Ran at the start of each 'npm start'. This is in it's own function
 * so it can be repeatedly called if the user doesn't answer with
 * y, Y, yes, Yes, N, n, No or no.
 * @returns {boolean} true if the user is new, false if otherwise
 ******************************************************************/
 function newPlayerPrompt() {
    let playerResponse = prompt('Welcome Space Cadet! Is this your first time flying? (Y/N) ');
    if(playerResponse == 'y' || playerResponse == 'Y' ||
        playerResponse == 'yes' || playerResponse == 'Yes'){
        // New Account script
        return true;
    } else if(playerResponse == 'n' || playerResponse == 'N' ||
        playerResponse == 'no' || playerResponse == 'No'){
        // Ask for login
        return false;
    } else {
        // if the user didn't answer with a yes or no, ask again
        newPlayerPrompt();
    }
};

startScript();