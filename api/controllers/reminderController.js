'use strict';

const SECONDS_TO_MILLISECONDS = 1000;
const DEFAULT_DELAY_SECONDS = 1;
const MINIMUM_DELAY_MINUTES = 1;
const DEFAULT_MESSAGE = 'Hello! This is a default message.';
const REQUEST_DELIMITER = ',';

// Twilio Initializers
const TwilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.ping = function(req, res) {
    var response = 'Pong';
    console.log(response);
    res.json(response);
};

// Command to open: ngrok http 3000
exports.schedule = function(request, response) {
    try {
        console.log(`Request received: '${JSON.stringify(request.body)}'`);

        // Request is in the Body's Body due to Twilio's convention
        var smsRequest = parseSmsRequest(request.body.body);

        console.log(`Parsed SMS request ${JSON.stringify(smsRequest)}`);

        scheduleSms(smsRequest.message, smsRequest.recepientPhoneNumber, smsRequest.delay);

        var responseMessage = `SMS reminder successfully scheduled. It will be sent to '${smsRequest.recepientPhoneNumber}' after '${smsRequest.delay}' seconds with a message of '${smsRequest.message}'.`;
        returnToTwilio(responseMessage, response);
    } catch (exception) {
        returnToTwilio(exception, response);
    }
}

// Schedules a SMS text to be sent after a delay (in seconds)
function scheduleSms(message, recepientPhoneNumber, delay) {
    var validatedMessage = (message !== undefined && message !== '') ? message : DEFAULT_MESSAGE;
    var validatedDelay = isDelayValid(delay) ? delay : DEFAULT_DELAY_SECONDS;
    setTimeout(function() {
        sendSms(validatedMessage, recepientPhoneNumber);
    }, validatedDelay * SECONDS_TO_MILLISECONDS);

    console.log(`SMS message: '${validatedMessage}' was scheduled with a delay of: '${validatedDelay}s'. '${getDateTime()}'`);
}

function sendSms(message, recepientPhoneNumber) {
    console.log('Fake SMS was sent. Refactor to send the message.');
    return;

    TwilioClient.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recepientPhoneNumber
        })
        .then(message => console.log(`Sent SMS message: '${message}' to: '${recepientPhoneNumber}' with SID: '${message.sid}' at '${getDateTime()}'`))
        .done();
}

// TODO: Improve so that it captures the entire message if it contains the delimiter by accident 
// e.g. message is 604 111 1111, 1, Hi James, this is carl, how are you?
function parseSmsRequest(smsRequest) {
    // Extract phone number
    var phoneNumberEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (phoneNumberEndIndex < 0) {
        throw 'Request cannot be sceduled because it is not formatted properly. Proper formatting is <phone number, <delay>, <message>';
    }

    var recepientPhoneNumber = smsRequest.substring(0, phoneNumberEndIndex).trim();
    if (!isPhoneNumberValid(recepientPhoneNumber)) {
        throw 'Phone number is invalid. Enter a valid phone number.';
    }

    // Extract delay
    smsRequest = smsRequest.substring(phoneNumberEndIndex+1);
    var delayEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (delayEndIndex < 0) {
        throw 'Request cannot be sceduled because it is not formatted properly. Proper formatting is <phone number, <delay>, <message>';
    }

    var delay = parseInt(smsRequest.substring(0, delayEndIndex));
    if (!isDelayValid(delay)) {
        throw 'Delay is invalid. Enter a delay of at least 5 minutes.';
    }

    // Extract message
    var message = smsRequest.substring(delayEndIndex+1).trim();
    if (!isMessageValid(message)) {
        throw 'Message is invalid. Enter a valid message.';
    }
    
    return {
        recepientPhoneNumber: recepientPhoneNumber,
        delay: delay,
        message: message
    };
}

function returnToTwilio(message, response) {
    var responseMessage = new MessagingResponse();
    responseMessage.message(message);
    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(responseMessage.toString());
}

// TODO implement this stub
function isPhoneNumberValid(phoneNumber) {
    return true;
}

function isDelayValid(delay) {
    if (isNaN(delay) || delay === undefined || delay === '') {
        return false;
    } else if (delay < MINIMUM_DELAY_MINUTES) {
        return false;
    } else {
        return true;
    }
}

function isMessageValid(message) {
    if (message === undefined || message === '') {
        return false;
    } else {
        return true;
    }
}

function getDateTime() {
    var currentdate = new Date();
    return `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
}
