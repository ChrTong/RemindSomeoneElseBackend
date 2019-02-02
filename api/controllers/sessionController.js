/* 'use strict';
var mongoose = require('mongoose'),
Task = mongoose.model('Reminder');

// Loads all the requests from the data store to schedule them
exports.loadAll = function(callback) {
    // Return a [] of scheduled requests

    var searchParameters = {
        

        { a: { $exists: true } } 
    }

    Task.find({}, function(error, task) {
        if (error) {
            // TODO: throw
        }

        callback(task);
    });
}

// Stores the request in the data store, to be reloaded in the event of a restart
exports.store = function(recipientPhoneNumber, dateTime, message, callback) {
    recipientPhoneNumber = recipientPhoneNumber.trim();
    dateTime = dateTime.trim();
    message = message.trim();

    var reminder = {
        recipientPhoneNumber: recipientPhoneNumber,
        dateTime: dateTime,
        message: message
    };

    var saveReminder = new Task(reminder);
    saveReminder.save(function(error, task){
        if (error) {
            // TODO: throw or callback with error
        }

        callback(task);
    });
}

// Removes the request in the data store, 
exports.remove = function(recipientPhoneNumber, dateTime, message, callback) {
    recipientPhoneNumber = recipientPhoneNumber.trim();
    dateTime = dateTime.trim();
    message = message.trim();

    var searchParameters = {
        recipientPhoneNumber: recipientPhoneNumber,
        dateTime: dateTime,
        message: message
    };

    Task.remove(searchParameters, function(error, task){
        if (error) {
            // TODO: throw
        }

        // TODO: functionality to count how many removed, if 0 removed then there is an error
        
        callback(task);
    });
} */