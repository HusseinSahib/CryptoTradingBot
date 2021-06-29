/* 
This is is a crypto currency trading bot
Author: Hussein Sahib
Date last updated: June 27 2021
writing in JavaScript using Node.js 
Binance.US api used: https://github.com/binance-us
*/
/* 
This program looks at the five minutes candles provided by 
binance api, if it see a bullish pattren it buys using the 
maximum balance - $20 of USDT on the binance account. Once it sees 
a bearish pattren it sells the maximum amount of the coin bought
*/
const getCoinPrice = require('./getPrice.js');
const canBuyCoin = require('./canBuyCoin.js');
const coinsList = require('./getCandidateList');
const testBullishness = require('./testBullishness');

//This function intialize the program to be run by the main function.
async function runApplication(){
  console.log("\nLooking for eligiable coins to trade...");
  console.log("#########################################################");
  //Get the list of eligible coins 
  let coinsToCheck = await coinsList.createCandidateList();
  //Ptint the list of eligible coins
  console.log("\n#########################################################");
  console.log("Here is the list of eligible coins: ");
  console.log("#########################################################\n");
  console.log(coinsToCheck);
  console.log("\n#########################################################");
  console.log(" Next we will check for bullish coins");
  console.log("#########################################################\n");
  //If the list of eligible coins is bigger than zero then check if the coins in the list are bullish
  if(coinsToCheck.length > 0){
    let highestVolume = 0;
    let preferedCoin = '';
    let foundCoin = false;
    //going through the list of eligible
    for(i=0; i<coinsToCheck.length-1;i++){
      console.log("\nChecking if "+coinsToCheck[i].symbol+" is bullish");
      //wait for the isbullish function to return a boolean of bullishness of the coin
      if(await testBullishness.isbullish(coinsToCheck[i].symbol)){
        console.log("Bullish coin found: "+coinsToCheck[i].symbol);
        coinsToCheck[i].bullish = true;
        foundCoin =true;
        //keep track of the coin with the highest volume to buy it if there are two bullish coins at the same time 
        if(coinsToCheck[i].volume > highestVolume){
          preferedCoin = coinsToCheck[i].symbol;
          highestVolume = coinsToCheck[i].volume;
        }
      }
    }
    console.log("\n##############################################################################");
    console.log("Bullish coins will have a 'true' value in the 'bullish' field in the table below");
    console.log("##############################################################################");
    //Print the eligible coins table containing the final results. 
    console.log(coinsToCheck);
    //if a bullish coin was found buy it
    if(foundCoin){
      console.log("\n#########################################################");
      console.log("calculating the buy of "+preferedCoin);
      console.log("#########################################################\n");
      //get the price of the prefered coin 
      const coinPrice = await getCoinPrice.price(preferedCoin);
      //if there is an error getting the price don't buy
      if(coinPrice <= 0){
        console.log('we are facing dificulties getting the price');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 0;
      }
      console.log("\n#########################################################");
      console.log("Attemptin to buy "+preferedCoin);
      console.log("#########################################################\n");
      //buy the coin
      let  buy = await canBuyCoin.enoughMoney(coinPrice,preferedCoin);
      //return success to the main function running the program
      if(buy ==1){
        return 1;
      }
      //When buy fail print error and return failed to the main function running the program
      console.log('can not buy ' + preferedCoin + " due to an error or not enough money");
      return 0;
      
    }
    //If there is no bullish coin found return no coin bought/fail to buy to the main function running the program
    return 0;
  }
  //When there are no eligible coins with high enough volume to trade
  else{
    console.log("no eligible coins found we will check again in a minute");
    return 0;
  }
}

//This is the main function that runs the program
async function main(){
  console.log("\n#########################################################");
  console.log(  "$$$$$$$$$$$$$$   application starting   $$$$$$$$$$$$$$$$$")
  console.log(  "#########################################################\n");
  //run the application
  let runapp = await runApplication();
  //keep running the application
  while (true){
    //If no coins were bought wait 3 minutes and run again
    if (runapp === 0){
      console.log('waiting 3 minutes and running the application again: ')
      await new Promise(resolve => setTimeout(resolve, 180000));
      runapp = await runApplication();
    }
    else{
      //if a coin was bought run right away again
      runapp = await runApplication();
    }
  }
}

//Calling the function that manages and runs the program
main();
