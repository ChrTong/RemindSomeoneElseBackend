'use strict';
module.exports = function(app) {
    var reminders = require('../controllers/reminderController');

    app.route('/ping')
        .post(reminders.ping)
        .get(reminders.ping);

    app.route('/schedule')
        .post(reminders.schedule);
};