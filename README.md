# RemindSomeoneElseBackend
Backend of the RemindSomeoneElse project

RemindSomeoneElse allows users to schedule a text message to be sent to a target phone number with a message. It is more convenient than other services because it requires no set up. No sign ups or installations required. Just text the RemindSomeoneElse number to schedule a reminder for someone else.

**Please note that RemindSomeoneElse is a personal project and is not a production level service. I cannot guarantee that the service will always be available, and may from time to time, fail to send messages (e.g. if my Twilio balance runs out or the Heroku server goes down). While I do not have any malicious intent in regards to reading or sending messages, I cannot guarantee that the 3rd party services are the same.**

## How do I use it?
Text the RemindSomeoneElse phone number with a reminder. The request is formatted as `<phone number`>, `<delay in minutes`>, `<message`>. You will receive either a message that indicates that the request was successfully scheduled on an error message with steps on how to fix the request.  

`<phone number`> is the recipient phone number you want to send the message to.  
`<delay in minutes`> is how far in the future you want the message to be sent. Note that reminders must have a delay of at least 5 minutes in order to prevent abuse.  
`<message`> the reminder you want to send someone.  

## How does it work?
When the RemindSomeoneElse phone number receives a text, Twilio receives the response and sends it to the RemindSomeoneElse server. Requests are sent as a HTTP POST request to the NodeJS server that is hosted on Heroku. The request body contains the phone number, delay, and message. If the request is valid, the server schedules a message to be sent after the appropriate delay. It then uses Twilio to send the scheduled reminder.

## What did I use to build it?
Code and Service
- Server is written in [node.js](https://nodejs.org/en/)
- [Heroku](https://dashboard.heroku.com/login) hosts the server
- The [Twilio](https://www.twilio.com/) service allows SMS messages to be sent and received
