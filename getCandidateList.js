/* 
This module checks for eligables coins that have high
enough 24 hour volume to make them safe to trade. It starts
with an initial preferred coins and then choose from 
the list
*/
//Eligable coins
//{ADA, ATOM, BCH,BTC,COMP,DOGE,
//EGLD, ETC, ETH, HNT,LTC, MKR, NEO,
//SOL,UNI,VET, XLM}

var getRequest = require('./publicRequest');
module.exports.createCandidateList = async function() {
    const intialEligableSymbols= ['ADAUSDT', 'ATOMUSDT', 'BCHUSDT','BTCUSDT','COMPUSDT','DOGEUSDT','EGLDUSDT', 
    'ETCUSDT', 'ETHUSDT', 'HNTUSDT' ,'LTCUSDT' , 'MKRUSDT', 'NEOUSDT','SOLUSDT','UNIUSDT','VETUSDT', 'XLMUSDT'];  
    let eligableCoinsList = [];
    try {
      for(i=0; i<intialEligableSymbols.length;i++){
        const publicInforamtion = await getRequest.publicRequest({
            symbol:intialEligableSymbols[i]
        },'/api/v3/ticker/24hr', 'get');
        if(publicInforamtion.data == undefined){
          console.log('can not get eligable coin, please check the problem');
          return {};
        }
        
        console.log("\nChecking if '"+intialEligableSymbols[i]+"' has enough volume to be eligable..." )
        if(publicInforamtion.data.quoteVolume >= 500000){                  
            eligableCoinsList.push({symbol: publicInforamtion.data.symbol, bullish:false,volume:publicInforamtion.data.quoteVolume});
        }
      }
      return eligableCoinsList;
    }
    catch (err) {
      console.log(err);
      return {};
    }
  };

