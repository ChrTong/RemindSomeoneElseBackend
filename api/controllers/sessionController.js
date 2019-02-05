'use strict';
var mongoose = require('mongoose'),
    ReminderTask = mongoose.model('Reminder');

// Loads all the requests from the data store to schedule them
exports.loadAll = function(callback) {
    // Return a [] of scheduled requests
    if (process.env.MONGODB_ENABLED) {
        var queryParameters = {
            dateTime: { $exists: true },
            recipientPhoneNumber: { $exists: true },
            message: { $exists: true }
        }

        ReminderTask.find(queryParameters, function(error, task) {
            if (error) {
                // TODO: throw
            }

            console.log(`Loaded all reminders from MongoDB: '${JSON.stringify(task)}'`);

            callback(task);
        });
    }
}

// Stores the request in the data store, to be reloaded in the event of a restart
exports.save = function(recipientPhoneNumber, dateTime, message, callback) {
    if (process.env.MONGODB_ENABLED) {
        recipientPhoneNumber = recipientPhoneNumber.trim();
        dateTime = dateTime.trim();
        message = message.trim();

        var reminder = {
            recipientPhoneNumber: recipientPhoneNumber,
            dateTime: dateTime,
            message: message
        };

        var saveReminder = new ReminderTask(reminder);
        saveReminder.save(function(error, task) {
            if (error) {
                // TODO: throw or callback with error
            }

            console.log(`Saved a reminder to MongoDB: ${JSON.stringify(reminder)}`);

            callback(task);
        });
    }
}

// TODO: should i include the date time in this request?
// TODO: should i use a GUID instead to identify requests?
// Removes the request in the data store
exports.delete = function(recipientPhoneNumber, dateTime, message, callback) {
    if (process.env.MONGODB_ENABLED) {
        recipientPhoneNumber = recipientPhoneNumber.trim();
        dateTime = dateTime.trim();
        message = message.trim();

        var searchParameters = {
            recipientPhoneNumber: recipientPhoneNumber,
            dateTime: dateTime,
            message: message
        };

        ReminderTask.remove(searchParameters, function(error, task) {
            if (error) {
                // TODO: throw
            }

            console.log(`Removed reminder from MongoDB: '${JSON.stringify(task)}'`)

            // TODO: functionality to count how many removed, if 0 removed then there is an error
            
            callback(task);
        });
    }
}