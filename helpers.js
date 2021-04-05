const market = require('./Api/marketplace.js');

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
 * Pause the script for a number of milliseconds (seconds * 1000)
 * @param {Number} ms The time in milliseconds we want the script to pause for
 * @returns {Promise} returning a promise allows us to pause using the await keyword
 */
 function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getMaterialSize = getMaterialSize;
exports.sleep = sleep;