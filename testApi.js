const cron = require("node-cron");
require('dotenv').config({
    path: '.env'
});


require('../db/connection');
console.log( "sdksjdkjskdjksjdkjsjdkjk")


//const rabbitMQ = require('../helpers/rabbitMQ');
const Testapi = require('../plugin/revlinker/offers');

( async function () {
    // body of the function
    var content={
        "credentials":{api_key:"57f14d8df6fc675e84eb1ceaa3f1166880d603f0"}
    }
    await  Testapi.offersApiCall(content);
  }());
// (async ( )=>{
//     console.log( 'sdsdsdsdsd=============')
//     await  Taptica.callTapticaApi();
// }())

    // (()=>{
        
    // }());

// callApplyApi = async () => {
//     try {
//         amqpConn = await rabbitMq.start();
//         let res = await Taptica.startPublisher();
//         if (res)
//             {pubChannel.close(); }
//     }
//     catch (err) {
//         // debug(err);
//     }

//}

