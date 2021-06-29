/* 
This module checks if there is bearish candle pattren
When it finds one, it calls the sell modules to sell the
coin we bought earlier

source for pattrens:
https://www.ig.com/us/trading-strategies/16-candlestick-patterns-every-trader-should-know-180615
*/
var getRequest = require('./publicRequest');
var sell = require('./sell.js');

module.exports.sellorder = async function(Coin,boughtPrice,symbol,stepSize,quantity) {
  let sold = false;
  let currentPrice  = parseFloat(boughtPrice);
  let stopLossPrice = currentPrice;
  let count = 0;
  try {
    await new Promise(resolve => setTimeout(resolve, 300000));
    while(!sold){
      //wait one minute between runs
      await new Promise(resolve => setTimeout(resolve, 60000));
      console.log('#####################');
      const coinPriceRequest =await getRequest.publicRequest({symbol:Coin}, '/api/v3/ticker/price', 'get');
      
      if(coinPriceRequest.data == undefined){
        console.log('can not get price, please check the problem');
        return {data:'failed'};
      }
      currentPrice = parseFloat(((coinPriceRequest).data).price);
      if(currentPrice > stopLossPrice){
          stopLossPrice = currentPrice;
      }
      console.log('Time running: '+ (1 + (count*1) + " minute(s)"));
      console.log("We are lookin at "+Coin);
      console.log('Bought Price : ', boughtPrice);
      console.log('current Price: ', currentPrice);
      console.log("profits      : "+((currentPrice*quantity)-(boughtPrice*quantity)));

      //Request the candles from Binance API
      const intervals = await getRequest.publicRequest({
        symbol: Coin,
        interval:'3m'
      }
      , '/api/v3/klines', 'get');
      if(intervals.data == undefined){
        console.log('can not get candles, please check the problem');
        return false;
      }
      /* 
      Hanging man pattern found
      */
      const intervalsNum = intervals.data.length;
      if(
        (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))>0)&&
        (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&&  
        (parseFloat(intervals.data[intervalsNum-3][3])) < ((parseFloat(intervals.data[intervalsNum-3][4])) - (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))*(-2.2)))&
        ((parseFloat(intervals.data[intervalsNum-3][2])) <= (parseFloat(intervals.data[intervalsNum-3][1])))&&
        ((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))<0
      ){
        const selling = await sell.sellOrder(stepSize,currentPrice,Coin,symbol);
        console.log("reason for sale: Hanging man");
        return selling;
      }
      /* 
      shooting star pattern found
      */
      else if(
        (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))>0)&&  
        (((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))<0)&&  
        (parseFloat(intervals.data[intervalsNum-2][3])) > (parseFloat(intervals.data[intervalsNum-2][4]))&&
        ((parseFloat(intervals.data[intervalsNum-2][2])) > ((parseFloat(intervals.data[intervalsNum-2][1])) + ((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))*(-2.2)))
        ){
        const selling = await sell.sellOrder(stepSize,currentPrice,Coin,symbol);
        console.log("reason for sale: shooting star");
        return selling;
      }
      /* 
      Bearish engulfing pattern found
      */
      else if(
        ((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))>0&&
        ((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))<0&&
        (parseFloat(intervals.data[intervalsNum-3][2])) < (parseFloat(intervals.data[intervalsNum-2][2]))&&
        ((parseFloat(intervals.data[intervalsNum-3][3])) > (parseFloat(intervals.data[intervalsNum-2][3])))&&
        (parseFloat(intervals.data[intervalsNum-3][1])) > (parseFloat(intervals.data[intervalsNum-2][4]))&&
        (parseFloat(intervals.data[intervalsNum-3][4])) < (parseFloat(intervals.data[intervalsNum-2][1]))&&
        (((parseFloat(intervals.data[intervalsNum-1][4])) - (parseFloat(intervals.data[intervalsNum-1][1])))<=0)
      ){
        const selling = await sell.sellOrder(stepSize,currentPrice,Coin,symbol);
        console.log("reason for sale: Bearish engulfing");
        return selling;
      }
      /* 
      Evening Star pattern found
      */
      else if(
        (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))>0)&&
        (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))<0)&&
        ((parseFloat(intervals.data[intervalsNum-3][4])) >= (parseFloat(intervals.data[intervalsNum-4][4])))&&
        ((parseFloat(intervals.data[intervalsNum-3][4])) >= (parseFloat(intervals.data[intervalsNum-2][1])))&&
        ((parseFloat(intervals.data[intervalsNum-3][1])) >= (parseFloat(intervals.data[intervalsNum-2][1])))&&
        ((parseFloat(intervals.data[intervalsNum-3][1])) >= (parseFloat(intervals.data[intervalsNum-4][4])))&&
        (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1]))))>((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))*(-4)&&
        (((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1]))))>((parseFloat(intervals.data[intervalsNum-3][4]))*(-1) - (parseFloat(intervals.data[intervalsNum-3][1])))*(-2)
      ){
        const selling = await sell.sellOrder(stepSize,currentPrice,Coin,symbol);
        console.log("reason for sale: Evening Star");
        return selling;
      }
      /* 
      Three black cows pattern found
      */
      else if(
        ((parseFloat(intervals.data[intervalsNum-5][4])) - (parseFloat(intervals.data[intervalsNum-5][1])))>0&&
        (((parseFloat(intervals.data[intervalsNum-4][4])) - (parseFloat(intervals.data[intervalsNum-4][1])))<0)&&
        (((parseFloat(intervals.data[intervalsNum-3][4])) - (parseFloat(intervals.data[intervalsNum-3][1])))<0)&&
        (((parseFloat(intervals.data[intervalsNum-2][4])) - (parseFloat(intervals.data[intervalsNum-2][1])))<0)
      ){
        const selling = await sell.sellOrder(stepSize,currentPrice,Coin,symbol);
        console.log("reason for sale: Three black cows");
        return selling;
      }
      count++;
      }
      return {data:'failed'};
    }
    
  catch (err) {
      console.log(err);
      console.log('stoploss is not working');
      await new Promise(resolve => setTimeout(resolve, 10000));
      return {data:'failed'};
    }
};