/* 
This module sells the maximum amount of the coin requested to sell
*/
var postRequest = require('./privateRequest');
var manageOrder = require('./placeOrder');
module.exports.sellOrder = async function(stepSize,currentPrice,Coin,symbol) {
    try {
        const privateInformation =await postRequest.privateRequest({
            timestamp:Date.now()
          }, '/api/v3/account', 'get');
          if(privateInformation.data == undefined){
            console.log('can not get quantity, please check the problem');
            return {data:'failed'};
          }
          const balance = privateInformation.data.balances;
          let sellQ = 0;
          //Get the amount we can sell by adding the step sizes until we can use all the money we can
          for(i=0; i<balance.length;i++){
            if(balance[i].asset == symbol){
              for(;(sellQ+stepSize)<parseFloat(balance[i].free); ){
                sellQ +=stepSize;
              }
            }
          }
          sellQ = parseFloat(await Number((sellQ).toFixed(6)));
          console.log(" Selling "+sellQ+" of "+ Coin + " for price: "+currentPrice);
          sellOrder = await manageOrder.orderOnline(Coin,'SELL',sellQ);
          if(sellOrder == 'failed'){
              console.log('can not sell order, please check the problem');
              return {data:'failed'};
            }
          sold = true;
          //returns the order details sent back by binance
          return sellOrder;
      }
    catch (err) {
        console.log(err);
        return {data:'failed'};
      }
};