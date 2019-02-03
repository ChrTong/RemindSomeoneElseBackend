const request = require('request');

const FIVE_MIN_DELAY = 300000; // 5 minute delay in milliseconds
const FIVE_SECOND_DELAY = 5000; // 5 second delay in milliseconds

const LOCALHOST_URL = 'http://localhost:3000/ping';

function ping() {
    request(process.env.PING_URL || LOCALHOST_URL, { json: true }, (err, res, body) => {
        if (err) { 
            return console.log(`ERROR in pinging: ${err}`); 
        }
        
        console.log(`Ping was successful`);
      });

    schedulePing();
}

function schedulePing() {
    var delay = (process.env.ENV === 'dev') ? FIVE_SECOND_DELAY : FIVE_MIN_DELAY;

    console.log(`Scheduling next ping to be sent in '${convertMsToMinutes(delay)}' minutes`);

    setTimeout(function() {
        ping();
    }, delay);
}

function convertMsToMinutes(ms) {
    return ms / (1000 * 60); // 1000 ms in a second, 60 seconds in a minute
}

module.exports.schedule = function() {
    console.log('Scheduling initial ping');
    
    schedulePing();
}