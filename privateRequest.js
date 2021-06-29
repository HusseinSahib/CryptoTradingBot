// ######################################################################
//https://stackoverflow.com/questions/50304411/binance-api-hmac-signature
//#######################################################################
//Binance requirments BaseApi+ApiExtention+?+Data+signature, and Header (signature and header are not always required)
//How to use:
//do
//var postRequest = require('./privateRequest')
//Declare an object of data like this one: 
//Example of a data
/* const data = {
  symbol: 'ARKBTC',
  recvWindow: 20000,
  timestamp: Date.now(),
}; */
//Then
//Call const Info = postRequest.privateRequest(data, ApiExtention, RequestType); 
//Example: privateRequest.privateRequest(data, '/api/v3/allOrders', 'POST');
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

const binanceConfig = {
  //Provide api information here. 
  API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  API_SECRET: 'XXXXXXXXXXXXXXXXXXXXXXX',
  HOST_URL: 'https://api.binance.us',
};

const buildSignature = (data, config) => {
  return crypto.createHmac('sha256', config.API_SECRET).update(data).digest('hex');
};
//endpoint is the url extention after the base url
//type is 'POST' or 'GET'
//data is just what comes after the ?
module.exports.privateRequest = async function(data, endPoint, type) {
  const dataQueryString = qs.stringify(data);
  const signature = buildSignature(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url: binanceConfig.HOST_URL + endPoint + '?' + dataQueryString + '&signature=' + signature,
    headers: {
      'X-MBX-APIKEY': binanceConfig.API_KEY,
    },
  };

  try {
    //console.log('URL: ', requestConfig.url);
    const response = await axios(requestConfig);
    if(response.data == undefined){
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
