/* 'use strict';

const FIRST_VALID_YEAR = 2019;
const FIRST_HOUR = 1; // The first hour is 1:00 (not 0:00)
const LAST_HOUR = 12; // The last hour is 12:00 (not 11:00 or 23:00)
const FIRST_MINUTE = 0; // The first valid minute is
const LAST_MINUTE = 59;

// Date Time split indices from request, split by spaces (e.g. ' ')
const MONTH_INDEX = 0;
const DAY_INDEX = 1;
const YEAR_INDEX = 2;
const TIME_INDEX = 3;
const MERIDIAN_INDEX = 4;

// Time split indices from request, split by ':'
const HOUR_INDEX = 0;
const MINUTE_INDEX = 1;

const MERIDIAN_AM = 'AM';
const MERIDIAN_PM = 'PM';

var MonthEnum = {
    'january': 0,
    'february': 1,
    'march': 2,
    'april': 3,
    'may': 4,
    'june': 5,
    'july': 6,
    'august': 7,
};

// Loads date from request via SMS or web
function retrieveDelayFromRequest(dateTime) {
    var parsedDateTime = parseDateTimeString(dateTime);
    if (isDateTimeValid(parsedDateTime.year, validateDateTime.month, validateDateTime.day, validateDateTime.hour, validateDateTime.minute, validateDateTime.meridian)) {
        return convertDateTimeToDelay(year, month, day, hour, minute, meridian);
    } else {
        // TODO: throw
    }
}

// Loads date from stored session in data store
function retrieveDelayFromSession(year, month, day, hour, minute) {
    if (isDateTimeValid(year, month, day, hour, minute, meridian)) {
        return convertDateTimeToDelay(year, month, day, hour, minute, meridian);
    } else {
        // TODO: throw
    }
}

function convertDateTimeToDelay(year, month, day, hour, minute, meridian) {
    if (meridian.toUpperCase() === MERIDIAN_PM) {
        hour += 12;
    }

    return new Date(year, month, day, hour, minute).getTime() - Date.now();
}

function parseDateTimeString(dateTimeString) {
    var splitDateTimeString = dateTimeString.split(' ');
    if (splitDateTimeString.length != 5) { // There are 5 components to a date: year, month, day, time, am/pm
        // TODO: throw
    }

    var month = splitDateTimeString[MONTH_INDEX];
    var day = splitDateTimeString[DAY_INDEX];
    var year = splitDateTimeString[YEAR_INDEX];
    var time = splitDateTimeString[TIME_INDEX];
    var meridian = splitDateTimeString[MERIDIAN_INDEX];

    var splitTimeString = time.split(':');
    if (splitDateTime.length != 2) {
        // TODO: throw
    }
    var hour = splitTime[HOUR_INDEX];
    var minute = splitTime[MINUTE_INDEX];

    return {
        'year': year,
        'month': month,
        'day': day,
        'hour': hour,
        'minute': minute,
        'meridian': meridian
    };
}

function isDateTimeValid(year, month, day, hour, minute, meridian) {
    return isDateValid(year, month, day) && isTimeValid(hour, minute, meridian);
}

function isDateValid(year, month, day) {
    var date = `${month} ${day}, ${year}`;
    return (Date.parse(date) != undefined && Date.parse(date) != 'NaN');
}

function isTimeValid(hours, minutes, meridian) {
    if (hours < FIRST_HOUR) {
        return false;
    } else if (hours > LAST_HOUR) {
        return false;
    }

    if (minutes < FIRST_MINUTE) {
        return false;
    } else if (minutes > LAST_MINUTE) {
        return false;
    }

    if (meridian.toUpperCase() !== MERIDIAN_AM && meridian.toUpperCase() !== MERIDIAN_PM) {
        return false;
    }

    return true;
}
 */