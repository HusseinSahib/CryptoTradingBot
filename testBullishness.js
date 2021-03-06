//https://www.investopedia.com/articles/active-trading/062315/using-bullish-candlestick-patterns-buy-stocks.asp
/* 
This module checks if a crypto currency is bullish and returns true if it is and false if not.
It uses 5 minutes candles from binance API to find bullish candle pattrens to determine if the coin is
bullish or not. 
*/

var getRequest = require('./publicRequest');
module.exports.isbullish = async function(coinSymbol) {
  try {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    const coinPriceRequest =await getRequest.publicRequest({symbol:coinSymbol}, '/api/v3/ticker/price', 'get');
    const price = parseFloat(((coinPriceRequest).data).price);
    if(coinPriceRequest.data == undefined){
      console.log('can not get price, please check the problem');
      return false;
    }
    const intervals = await getRequest.publicRequest({
      symbol: coinSymbol,
      interval:'5m'
    }
    , '/api/v3/klines', 'get');
    if(intervals.data == undefined){
      console.log('can not get candles, please check the problem');
      return false;
    }
    const intervalsNum = intervals.data.length;
    console.log("current price       : "+ price);
    console.log("price 25 candles ago: "+ (parseFloat(intervals.data[intervalsNum-25][1])));
    /* 
    Check for inverted hummer pattren
    */
    if(
    (((parseFloat(intervals.data[intervalsNum-25][1])) > (parseFloat(intervals.data[intervalsNum-4][1]))))&&
    (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))<0)&&
    (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&& 
    ((parseFloat(intervals.data[intervalsNum-2][2])) > (parseFloat(intervals.data[intervalsNum-3][2])))&&
    ((parseFloat(intervals.data[intervalsNum-2][1])) < (parseFloat(intervals.data[intervalsNum-3][4])))&&
    ((parseFloat(intervals.data[intervalsNum-2][4])) < (parseFloat(intervals.data[intervalsNum-3][4])))&&
    ((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))>0
    ){ 
    console.log("The inverted hummer pattren found");
    return true;
    } 
    /* 
    Check for hummer pattren
    */
    else if(
    //check if 4 candles ago was negative
    (((parseFloat(intervals.data[intervalsNum-25][1])) > (parseFloat(intervals.data[intervalsNum-4][1]))))&&
    (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))<0)&&
    (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&& 
    ((parseFloat(intervals.data[intervalsNum-2][3])) < (parseFloat(intervals.data[intervalsNum-3][3])))&&
    ((parseFloat(intervals.data[intervalsNum-2][1])) > (parseFloat(intervals.data[intervalsNum-3][1])))&&
    ((parseFloat(intervals.data[intervalsNum-2][4])) > (parseFloat(intervals.data[intervalsNum-3][1])))&&
    ((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))>0){
      console.log("The hummer pattren found");
      return true;
    }
    /* 
    Check for bullish engulfing pattren
    */
    else if(
    (((parseFloat(intervals.data[intervalsNum-25][1])) > (parseFloat(intervals.data[intervalsNum-4][1]))))&&
    (((parseFloat(intervals.data[intervalsNum-8][4])) - (parseFloat(intervals.data[intervalsNum-8][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-7][4])) - (parseFloat(intervals.data[intervalsNum-7][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-6][4])) - (parseFloat(intervals.data[intervalsNum-6][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-5][4])) - (parseFloat(intervals.data[intervalsNum-5][1]))))<0&&

    (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&&
    ((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))>0&&
    (parseFloat(intervals.data[intervalsNum-3][2])) < (parseFloat(intervals.data[intervalsNum-2][4]))&&
    ((parseFloat(intervals.data[intervalsNum-3][3])) > (parseFloat(intervals.data[intervalsNum-2][1])))&&
    ((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))>0
    )
    {
      console.log("The bullish engulfing pattren found");
      return true;
    }
    /* 
    Check for piercing line pattren
    */
    else if(
    (((parseFloat(intervals.data[intervalsNum-25][1])) > (parseFloat(intervals.data[intervalsNum-4][1]))))&&
    (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&&
    (((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))>0)&&
    //I might uncomment this if the outcome is negative, right it seems to me the buy orders are better without 
    //having a closing amount cap
    //(((parseFloat(intervals.data[intervalsNum-2][4])) < (parseFloat(intervals.data[intervalsNum-3][1])))<0)&&
    (parseFloat(intervals.data[intervalsNum-2][1])) < (parseFloat(intervals.data[intervalsNum-3][4]))&&
    ((parseFloat(intervals.data[intervalsNum-2][4])) > ((parseFloat(intervals.data[intervalsNum-3][1]))-(((parseFloat(intervals.data[intervalsNum-3][4]))-(parseFloat(intervals.data[intervalsNum-3][1])))*(-0.75))))&&
    (((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))>0)
    ){
      console.log("The piercing line pattren found");
      return true;
    } 
    /* 
    Check for morning star pattren
    */
    else if(
    //check if 4 candles ago was negative
    ((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))<0&&
    ((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))>0&&
    ((parseFloat(intervals.data[intervalsNum-3][4])) < (parseFloat(intervals.data[intervalsNum-4][4])))&&
    ((parseFloat(intervals.data[intervalsNum-3][1])) < (parseFloat(intervals.data[intervalsNum-4][4])))&&
    ((parseFloat(intervals.data[intervalsNum-3][4])) < (parseFloat(intervals.data[intervalsNum-2][1])))&&
    ((parseFloat(intervals.data[intervalsNum-3][1])) < (parseFloat(intervals.data[intervalsNum-2][1])))
    ){
      console.log("The morning star pattren found");
      return true;
    }
    /* 
    Check for three white soldiers pattren
    */
    else if(
    (((parseFloat(intervals.data[intervalsNum-25][1])) > (parseFloat(intervals.data[intervalsNum-4][1]))))&&
    (((parseFloat(intervals.data[intervalsNum-8][4])) - (parseFloat(intervals.data[intervalsNum-8][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-7][4])) - (parseFloat(intervals.data[intervalsNum-7][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-6][4])) - (parseFloat(intervals.data[intervalsNum-6][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-5][4])) - (parseFloat(intervals.data[intervalsNum-5][1]))))<0&&
    (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))>0)&&
    (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))>0)&&
    (((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))>0)&&
    (((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))>0)
    )
    {
      console.log("The three white soldiers pattren found");
      return true;
    }
    /* 
    no pattren found
    */
    else{
      console.log("No bullish pattren found");
      return false;
    }
  }
  catch (err) {
    console.log(err);
    return false;
  } 
};