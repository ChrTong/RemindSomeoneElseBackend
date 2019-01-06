'use strict';

const SECONDS_TO_MILLISECONDS = 1000;
const MINIMUM_DELAY_MINUTES = 1;
const REQUEST_DELIMITER = ',';

// Twilio Initializers
const TwilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.ping = function(request, response) {
    var message = 'pong';
    console.log(message);
    response.json(message);
};

exports.schedule = function(request, response) {
    try {
        console.log(`Request received: '${JSON.stringify(request.body)}'`);

        // Request is in the body.body due to Twilio's convention
        var smsRequest = parseSmsRequest(request.body.body);

        console.log(`Parsed SMS request: '${JSON.stringify(smsRequest)}'`);

        validateRequest(smsRequest.message, smsRequest.recepientPhoneNumber, smsRequest.delay);
        scheduleSms(smsRequest.message, smsRequest.recepientPhoneNumber, smsRequest.delay);
        var responseMessage = `SMS reminder successfully scheduled. It will be sent to '${smsRequest.recepientPhoneNumber}' after '${smsRequest.delay}' minutes with a message of '${smsRequest.message}'.`;
        returnToTwilio(responseMessage, response);
    } catch (exception) {
        // TODO check if other error codes (e.g. 500 work)
        returnToTwilio(exception, response);
    }
}

// Schedules a SMS text to be sent after a delay (in minutes)
function scheduleSms(message, recepientPhoneNumber, delay) {
    setTimeout(function() {
        sendSms(message, recepientPhoneNumber);
    }, delay * SECONDS_TO_MILLISECONDS);

    console.log(`SMS message: '${message}' was scheduled with a delay of: '${delay} minutes'. '${getDateTime()}'`);
}

function sendSms(message, recepientPhoneNumber) {
    TwilioClient.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recepientPhoneNumber
        })
        .then(message => console.log(`Sent SMS message: '${message}' to: '${recepientPhoneNumber}' with SID: '${message.sid}' at '${getDateTime()}'`))
        .done();
}

// Parses the body of the web request made to the server to interpret the SMS request
function parseSmsRequest(smsRequest) {
    // Extract phone number
    var phoneNumberEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (phoneNumberEndIndex < 0) {
        throw 'Request cannot be sceduled because it is not formatted properly. Proper formatting is <phone number, <delay>, <message>';
    }

    var recepientPhoneNumber = smsRequest.substring(0, phoneNumberEndIndex).trim();

    // Extract delay
    smsRequest = smsRequest.substring(phoneNumberEndIndex+1);
    var delayEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (delayEndIndex < 0) {
        throw 'Request cannot be sceduled because it is not formatted properly. Proper formatting is <phone number, <delay>, <message>';
    }

    var delay = parseInt(smsRequest.substring(0, delayEndIndex));
    
    // Extract message
    var message = smsRequest.substring(delayEndIndex+1).trim();

    return {
        recepientPhoneNumber: recepientPhoneNumber,
        delay: delay,
        message: message
    };
}

function validateRequest(message, recepientPhoneNumber, delay) {
    if (!isMessageValid(message)) {
        throw 'Message is invalid. Enter a valid message.';
    }

    if (!isPhoneNumberValid(recepientPhoneNumber)) {
        throw 'Phone number is invalid. Enter a valid phone number.';
    }

    if (!isDelayValid(delay)) {
        throw 'Delay is invalid. Enter a number of at least 5 minutes.';
    }
}

// Constructs and sends an appropriate response for Twilio to interpret
function returnToTwilio(message, response) {
    var responseMessage = new MessagingResponse();
    if (message === undefined || message === '') {
        message = 'Error no response message';
    }

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
