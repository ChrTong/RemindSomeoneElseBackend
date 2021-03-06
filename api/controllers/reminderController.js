'use strict';

const REQUEST_DELIMITER = ',';
var SessionController = require('../controllers/sessionController');

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
        console.log(`${getDateTime()}: Request body received: '${JSON.stringify(request.body, null, 2)}'`);

        // Request is in the body.Body due to Twilio's convention
        var smsRequest = parseSmsRequest(request.body.Body);

        console.log(`Parsed SMS request: '${JSON.stringify(smsRequest, null, 2)}'`);

        // Validate request parameters
        validateRequest(smsRequest.message, smsRequest.recipientPhoneNumber, smsRequest.dateTime);

        // Schedule the SMS request
        scheduleSms(smsRequest.message, smsRequest.recipientPhoneNumber, smsRequest.dateTime);

        // Send a success response back
        var responseMessage = `SMS reminder successfully scheduled. It will be sent to '${smsRequest.recipientPhoneNumber}' at '${smsRequest.dateTime}' with a message of '${smsRequest.message}'.`;
        returnToTwilio(responseMessage, response);
    } catch (exception) {
        // TODO:check if other error codes (e.g. 500 work)
        console.log(`EXCEPTION: ${exception}`);

        returnToTwilio(exception, response);
    }
};

exports.initializeSessions = function() {
    console.log('Beginning to load reminders from MongoDB');

    SessionController.loadAll((reminders) => {
        reminders.forEach(function(reminder) {
            scheduleSms(reminder.message, reminder.recipientPhoneNumber, reminder.dateTime);
        });
    });
};

// Initialize sessions on startup
exports.initializeSessions();


// Schedules a SMS text to be sent after a delay (in minutes)
function scheduleSms(message, recipientPhoneNumber, dateTime) {
    var delay = calculateDelay(dateTime);

    /* // TODO: remove this hardcoded value
    delay = 500; */

    setTimeout(function() {
        sendSms(message, recipientPhoneNumber);
    }, delay);

    SessionController.save(recipientPhoneNumber, dateTime, message, () => {
        console.log(`${getDateTime()}: SMS message: '${message}' was scheduled to be sent at '${new Date(delay + Date.now())}'.`);
    });
}

function sendSms(message, recipientPhoneNumber) {
    if (process.env.ENV === 'dev') {
        console.log(`${getDateTime()}: FAKE SMS sent to '${recipientPhoneNumber}' with message '${message}'`);
    } else {
        TwilioClient.messages
            .create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: recipientPhoneNumber
            })
            .then(message => console.log(`Sent SMS message: '${JSON.stringify(message, null, 2)}' to: '${recipientPhoneNumber}' with SID: '${message.sid}' at '${getDateTime()}'`))
            .done(() => {
                SessionController.delete(recipientPhoneNumber, message);
            });

        // Send an admin the text as well for monitoring, since this is a personal project
        TwilioClient.messages
            .create({
                body: `ADMIN MESSAGE: ${message}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: process.env.ADMIN_PHONE_NUMBER 
            })
            .then(message => console.log(`Sent SMS message: '${JSON.stringify(message, null, 2)}' to: '${recipientPhoneNumber}' with SID: '${message.sid}' at '${getDateTime()}'`))
            .done();
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

// Parses the body of the web request made to the server to interpret the SMS request
function parseSmsRequest(smsRequest) {
    if (smsRequest === undefined || smsRequest.body === '') {
        throw 'SMS request is undefined';
    }

    // Extract phone number
    var phoneNumberEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (phoneNumberEndIndex < 0) {
        throw 'Request cannot be scheduled because it is not formatted properly. Proper formatting is <phone number>, <month> <day> <year> <hours>:<minutes> <AM/PM>, <message>';
    }

    var recipientPhoneNumber = smsRequest.substring(0, phoneNumberEndIndex).trim();

    // Extract delay
    // TODO: implement being able to read the date of the request and schedule it for them, rather than a delay
    smsRequest = smsRequest.substring(phoneNumberEndIndex+1);
    var dateTimeEndIndex = smsRequest.indexOf(REQUEST_DELIMITER);
    if (dateTimeEndIndex < 0) {
        throw 'Request cannot be scheduled because it is not formatted properly. Proper formatting is <phone number, <month> <day> <year> <hours>:<minutes> <AM/PM>, <message>';
    }

    var dateTime = smsRequest.substring(0, dateTimeEndIndex).trim();
    
    // Extract message
    var message = smsRequest.substring(dateTimeEndIndex+1).trim();

    return {
        recipientPhoneNumber: recipientPhoneNumber,
        dateTime: dateTime,
        message: message
    };
}

function validateRequest(message, recipientPhoneNumber, dateTime) {
    if (!isMessageValid(message)) {
        throw 'Message is invalid. Enter a valid message.';
    }

    if (!isPhoneNumberValid(recipientPhoneNumber)) {
        throw 'Phone number is invalid. Enter a valid phone number.';
    }

    if (!isDateTimeValid(dateTime)) {
        throw 'Date time is invalid. Enter a date time in the format of <month> <day> <year> <hours>:<minutes> <AM/PM>.';
    }
}

// Calculates the delay in 'ms'
function calculateDelay(dateTime) {
    dateTime += ' PST'; // TODO: add a conditional check if there is a time zone, and then append PST as default if there isnt
    if (!isDateTimeValid(dateTime)) {
        // TODO: throw 
        console.log('Date Time is invalid!');
    }

    var delay = new Date(dateTime).getTime() - Date.now();

    console.log(`Date Time Now: ${new Date(Date.now()).toString()}`)
    console.log(`Date Time Trg: ${new Date(new Date(dateTime).getTime()).toString()}`);

    return delay;
}

// TODO: implement this stub
function isPhoneNumberValid(phoneNumber) {
    return true;
}

function isDateTimeValid(dateTime) {
    var delay = new Date(dateTime).getTime();
    return !(delay == undefined || isNaN(delay));
}

function isMessageValid(message) {
    if (message === undefined || message === '') {
        return false;
    } else {
        return true;
    }
}

function getDateTime() {
    var currentDate = new Date();
    return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
}

