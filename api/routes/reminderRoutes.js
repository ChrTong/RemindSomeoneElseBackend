'use strict';
module.exports = function(app) {
    var reminders = require('../controllers/reminderController');

    app.route('/ping')
        .post(reminders.ping);

    app.route('/schedule')
        .post(reminders.schedule_sms);

    app.route('/receive')
        .post(reminders.receive_sms);
};