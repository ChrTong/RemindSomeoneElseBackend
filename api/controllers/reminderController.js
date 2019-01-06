'use strict';

const SECONDS_TO_MILLISECONDS = 1000;
const DEFAULT_DELAY_SECONDS = 1;
const MAXIMUM_DELAY_SECONDS = 5;
const DEFAULT_MESSAGE = 'Hello! This is a default message.';

// Twilio Initializers
const TwilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


exports.ping = function(req, res) {
    var response = 'Pong';

    console.log(response);

    // sendSms();

    res.json(response);
};

exports.schedule_sms = function(req, res) {
    scheduleSms(req.query.message, req.query.delay);
    res.json('SMS successfully scheduled');
};

// Command to open: ngrok http 3000
exports.receive_sms = function(req, res) {
    console.log('Request: ' + JSON.stringify(req.body.body));

    const twiml = new MessagingResponse();

    twiml.message('Hello my friend, you are successful!');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

// Schedules a SMS text to be sent after a delay (in seconds)
function scheduleSms(message, delay) {
    var validatedMessage = (message !== undefined && message !== '') ? message : DEFAULT_MESSAGE;
    var validatedDelay = isDelayValid(delay) ? delay : DEFAULT_DELAY_SECONDS;
    setTimeout(function() {
        sendSms(validatedMessage);
    }, validatedDelay * SECONDS_TO_MILLISECONDS);

    console.log(`SMS message: '${validatedMessage}' was scheduled with a delay of: '${validatedDelay}s'. '${getDateTime()}'`);
}

function sendSms(message) {
    /*
    TwilioClient.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.MY_PHONE_NUMBER
        })
        .then(message => console.log(`Sent SMS message: '${message}' with SID: '${message.sid}' at '${getDateTime()}'`))
        .done();
    */
}

// Helper Functions

function isDelayValid(delay) {
    if (isNaN(delay) || delay === undefined || delay === '') {
        console.log(`Delay: '${delay}' is not a number`);
        return false;
    } else if (delay > MAXIMUM_DELAY_SECONDS) {
        console.log(`Delay: '${delay}' exceeds the maximum of '${MAXIMUM_DELAY_SECONDS}'s`);
        return false;
    } else {
        console.log('Delay is valid');
        return true;
    }
}

function getDateTime() {
    var currentdate = new Date();
    return `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
}