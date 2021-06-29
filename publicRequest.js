//######################################################################
//https://stackoverflow.com/questions/50304411/binance-api-hmac-signature
//#######################################################################
//Binance requirments BaseApi+ApiExtention+?+Data+
//How to use:
//do
//var getRequest = require('./publicRequest')
//Declare an object of data like this one: 
//Example of a data
/* const data = {
  symbol: 'ARKBTC',
  recvWindow: 20000,
  timestamp: Date.now(),
}; */
//Then
//Call const Info = getRequest.publicRequest(data, ApiExtention, RequestType); 
//Example: privateRequest.privateRequest(data, '/api/v3/allOrders', 'POST');

const axios = require('axios');
const qs = require('qs');

module.exports.publicRequest = async function(data, endPoint, type) {
  const hostURL = 'https://api.binance.us';
  const dataQueryString = qs.stringify(data);
  const requestConfig = {
    method: type,
    url: hostURL + endPoint + '?' + dataQueryString
  };

  try {
    //console.log('URL: ', requestConfig.url);
    const response = await axios(requestConfig);
    
    if(response.data == undefined){
      //console.log(response);
      console.log('problem getting your request');
      return {data:undefined};
    }
    //console.log(response);
    return response;
  }
  catch (err) {
    console.log(err);
    return err;
  }
};