'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
    'dateTime': {
        type: 'String',
        required: 'The date time of the scheduled time'
    },

    /*
    'senderPhoneNumber': {
        type: 'String',
        required: 'Phone number of the sender'
    },
    */

    'recipientPhoneNumber': {
        type: 'String',
        required: 'Phone number of the recipient'
    },
    'message': {
        type: 'String',
        required: 'Message to be sent to the recipient'
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
