/* 
This module gets the price of the requested coin
*/
var getRequest = require('./publicRequest');
module.exports.price = async function(preferedCoin) {
    try {
      const coinPriceRequest =await getRequest.publicRequest({symbol:preferedCoin}, '/api/v3/ticker/price', 'get');
      const coinPrice = parseFloat(((coinPriceRequest).data).price);
      if(coinPriceRequest.data == undefined){
        console.log('can not get price, please check the problem');
        return -1;
      }
      console.log("current price "+ " of "+ preferedCoin +" is "+coinPrice);
      return coinPrice;
      }
    catch (err) {
        console.log(err);
        return -1;
      }
};