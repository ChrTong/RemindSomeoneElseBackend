require('dotenv').config()

var express = require('express'),
  app = express(),
  port = process.env.PORT,
  bodyParser = require('body-parser'),
  cors = require('cors');

// CORS must be enabled for web apps to retrieve data
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/reminderRoutes');
routes(app);

app.listen(port, () => {
    console.log(`RemindSomeoneElse Server started on port: ${port}`);
});

app.use(function(req, res) {
  res.status(404).send({url: `${req.originalUrl} not found`})
});