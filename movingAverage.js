var getRequest = require('./publicRequest');
//api only returns the last 500 results
//about 15% error on each moving avaerage
//can do 0-9 days average only because the api only returns 501 results
//##################################
//How to use:
//do
//var mv = require('./movingAverge')
//Declare number of days like this one: 
//Example of a data
//const days = 30;
//Then
//Call const Info = mv.movingAverage(day,coinSymbol); 
//Example: privateRequest.privateRequest(data, '/api/v3/allOrders', 'POST');
module.exports.movingAverage = async function(days,coinSymbol,candleSize,timesInDay) {
    const candlessInDay =timesInDay;
    const data = {
        symbol: coinSymbol,
        interval:candleSize,
        limit:1000
    };
    try {
        const intervals = await getRequest.publicRequest(data, '/api/v3/klines', 'get');
        //console.log(intervals);
        const intervalsNum = intervals.data.length;
        let sum =0;
        for(h = 1; h<=(days*candlessInDay); h++){
            sum += (parseFloat(intervals.data[intervalsNum-h][1])+parseFloat(intervals.data[intervalsNum-h][4]))/2;
          }
        const mv =sum/(days*candlessInDay);
        return mv;
      }
    catch (err) {
        console.log(err);
        return 0;
      }
};
