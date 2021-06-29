/* 
This module buys or sells the requested quantity of the requested coin 
*/
var postRequest = require('./privateRequest');
module.exports.orderOnline = async function(Coin,type,quantity) {
  try {
      const data ={
        symbol:Coin,
        side:type,
        type:'MARKET',
        quantity:quantity,
        timestamp:Date.now()
      };
      const privateInformation =await postRequest.privateRequest(data, '/api/v3/order', 'post');
      if(privateInformation.data == undefined){
        return 'failed';
      }
      return privateInformation.data;
    }
  catch (err) {
      console.log(err);
      return 'failed';
    }
};