const prompt = require('prompt-sync')({sigint: true});
const newAccount = require('./newAccount.js');
const existingAccount = require('./existingAccount.js');
const loop = require('./theLoop.js');

/*******************************************************************************
 * This kicks off the player creation and login. This file should be left alone.
 * All editing for this project should take place in theLoop.js
 ******************************************************************************/
async function startScript(){

    let playerInfo;
    console.log(`Thanks for checking out my script! I worked pretty hard on it so any feedback is helpful :) you can use Control + C to stop the script at any time.\n\n`);
    const newPlayer = await newPlayerPrompt();
    // Very first thing, ask the player if they are new
    if(newPlayer){
        // The player is new, lets run the account creator from the newAccount.js file
        playerInfo = await newAccount.accountCreator();
        if(playerInfo == null){
            console.log(`Exiting Automation`);
            return;
        }
        loop.theLoop(playerInfo.username, playerInfo.token, playerInfo.shipId);
    } else {
        playerInfo = await existingAccount.retrievePlayerData();
        if(playerInfo.shipId == null){
            console.log(`Exiting Automation`);
            return;
        }
        console.log(`Ending start script for existing player`);
        console.log(playerInfo);
        // loop.theLoop(playerInfo.username, playerInfo.token, playerInfo.shipId);
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