/* 
This module determines how much we can buy of a coin 
depending on the balance in the account and the step sizes
required by binance. 
*/

var postRequest = require('./privateRequest');
var getRequest = require('./publicRequest');
var order = require('./placeOrder.js');
var stopL = require('./stoploss.js');
module.exports.enoughMoney = async function(CoinPrice,coinName) {
  try {  
    //get coin symbol to pass it to the sellOrder module to get the account balance
    let coinSymbol = '';
    for(i = 0; i<((coinName.length)-4);i++){
      coinSymbol+=coinName[i];
    }
    //get account balance
    const accountInformation =await postRequest.privateRequest({timestamp:Date.now()}, '/api/v3/account', 'get');
    if(accountInformation.data == undefined){
      console.log('can not get quantity, please check the problem');
      return 0;
    }
    const balance = accountInformation.data.balances;
    
    for(i=0; i<balance.length;i++){
      if(balance[i].asset == 'USDT'){
        //Check if the balance is enough
        if(parseFloat(balance[i].free) > 20){
            const publicInforamtion = await getRequest.publicRequest({}, '/api/v1/exchangeInfo', 'get');
            if(publicInforamtion.data == undefined){
              console.log('can not get quantity, please check the problem');
              await new Promise(resolve => setTimeout(resolve, 180000));
              return 0;
            }
            //Get the minum quantity, step size and max quantity to determine if the buy ammount is eligible
            const symbolsArray = publicInforamtion.data.symbols;
            for(k=0; k<symbolsArray.length;k++){
                if(symbolsArray[k].symbol==coinName){
                    const minQuantity = parseFloat((symbolsArray[k].filters[2].minQty));
                    const maxQuantity = parseFloat((symbolsArray[k].filters[2].maxQty));
                    const stepSize = parseFloat((symbolsArray[k].filters[2].stepSize));
                    let coinQuantity = 0;
                    //determine the buy quantity
                    for(coinQuantity=0; ((coinQuantity*CoinPrice) < (parseFloat(balance[i].free)-20)); ){
                      coinQuantity+=stepSize;
                    }
                    if (coinQuantity>minQuantity && coinQuantity < maxQuantity){
                      coinQuantity = parseFloat(await Number((coinQuantity).toFixed(6)));
                        console.log("can buy "+coinQuantity+ " of "+coinName);
                        //buy
                        const placeOrder = await order.orderOnline(coinName,'BUY',coinQuantity);
                        //call the stoploss module to determine when to sell
                        if(placeOrder != 'failed'){
                          console.log(placeOrder);
                          console.log(coinName+" coin bought, now running stop loss/collect profit function");
                          let stoploss = await stopL.sellorder(coinName,CoinPrice,coinSymbol,stepSize,coinQuantity);
                          while(stoploss.data == 'failed'){
                            console.log('we are facing dificulties calling stoploss');
                            stoploss = await stopL.sellorder(coinName,CoinPrice,coinSymbol,stepSize,coinQuantity);
                          }
                          console.log(stoploss);
                          return 1;
                          }
                        
                        return 0;
                    }
                    else{
                        return 0;
                    }
                }
            }
        } 
      }
    }
      return 0;
    }
  catch (err) {
      await console.log(err);
      console.log('can not get quantity, please check the problem');
      await new Promise(resolve => setTimeout(resolve, 180000));
      return 0;
    }
};