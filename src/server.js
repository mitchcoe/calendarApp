const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
// const knexConfig = require('./db/knexfile');
// const knex = require('knex')(knexConfig[process.env.NODE_ENV])
const app = express();
const port = 8080;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.get('/', (request, response) => response.json({ info: 'Node.js, Express, and Postgres API' }));
app.get('/events', db.getEvents);
app.get('/events/:year', db.getEventsByYear);
app.get('/events/:year/:month', db.getEventsByMonth);
app.get('/events/:year/:month/:day', db.getEventsByDay);
app.post('/events', db.createEvent);
app.put('/events', db.updateEvent);
app.delete('/events', db.deleteEvent);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
