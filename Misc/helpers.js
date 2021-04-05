const market = require('../Api/marketplace.js');

/**
 * Gets the volumePerUnit of a desired material
 * @param {String} token The token assoicated with a players username
 * @param {String} symbol The planet symbol (found in Api/planetTypes)
 * @param {String} material The type of material to get the size on (found in Api/MaterialTypes)
 * @returns {Number} The volumePerUnit of the requested material
 */
async function getMaterialSize(token, symbol, material){
  const marketInfo = await market.getMarketInfo(token, symbol);
  if(marketInfo.error){
    console.log('FAILED GETTING MATERIAL SIZE');
    console.log('----------------------------');
    console.log(marketInfo.error);
  }
  for(let i = 0; i < marketInfo.location.marketplace.length; i++){
    if(marketInfo.location.marketplace[i].symbol === material){
      return marketInfo.location.marketplace[i].volumePerUnit;
    }
  }

  return 0;
}

/**
 * Using the Distance formula we can calculate the distance 
 * between any 2 points in 2D space. 
 * Learn more about calculations here 
 * https://wgvu.pbslearningmedia.org/resource/mgbh.math.g.pythag/calculating-distance-using-the-pythagorean-theorem/
 * 
 * @param {Number} xCoord1 The x position of the first location
 * @param {Number} yCoord1 The y position of the first location
 * @param {Number} xCoord2 The x position of the second location
 * @param {Number} yCoord2 The y position of the second location
 * @returns {Number} Distance between the two locations
 */
 async function calcDistance(xCoord1, yCoord1, xCoord2, yCoord2){
  return Math.round(Math.sqrt(((xCoord2 - xCoord1) * (xCoord2 - xCoord1)) + ((yCoord2 - yCoord1) * (yCoord2 - yCoord1))));
}


/**
 * Pause the script for a number of milliseconds (seconds * 1000)
 * @param {Number} ms The time in milliseconds we want the script to pause for
 * @returns {Promise} returning a promise allows us to pause using the await keyword
 */
 function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getMaterialSize = getMaterialSize;
exports.calcDistance = calcDistance;
exports.sleep = sleep;