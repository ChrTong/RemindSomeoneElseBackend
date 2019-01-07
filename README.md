# RemindSomeoneElseBackend
Backend of the RemindSomeoneElse project

RemindSomeoneElse allows users to schedule a text message to be sent to a target phone number with a message. It is more convenient than other services because it requires no set up. No sign ups or installations required. Just text the RemindSomeoneElse number to schedule a reminder for someone else.

## How do I use it?
Text the RemindSomeoneElse phone number with a reminder. The request is formatted as `<phone number`>, `<delay in minutes`>, `<message`>. You will receive either a message that indicates that the request was successfully scheduled on an error message with steps on how to fix the request.  

`<phone number`> is the recepient phone number you want to send the message to.  
`<delay in minutes`> is how far in the future you want the message to be sent. Note that reminders must have a delay of at least 5 minutes in order to prevent abuse.  
`<message`> the reminder you want to send someone.  

## How does it work?
When the RemindSomeoneElse phone number receives a text, Twilio receives the response and sends it to the RemindSomeoneElse server. Requests are sent as a HTTP POST request to the NodeJS server that is hosted on Heroku. The request body contains the phone number, delay, and message. If the request is valid, the server schedules a message to be sent after the appropriate delay. It then uses Twilio to send the scheduled reminder.
