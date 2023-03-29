// const defaultData = require('./database/defaultData');
// require('dotenv').config()
const knex = require('knex')({
  client: 'pg',
  connection: {
    user: 'me',
    host: 'localhost',
    database: 'calendarapp',
    password: 'Bobcats#123!',
    port: 5432,
  }
});

// knex.schema.dropTableIfExists('blah');

// knex.schema.createTable('events', function (table) {
//   table.increments('event_id').primary().notNullable();
//   table.string('title').notNullable();
//   table.string('description').notNullable();
//   table.string('location').notNullable();
//   table.string('phone').notNullable();
//   table.timestamp('date').notNullable();
//   table.timestamp('start_time').notNullable();
//   table.timestamp('end_time').notNullable();
// });

// const deleteTable = knex('events').insert(defaultData, ['event_id'])
// const deleteTable = knex.schema.dropTableIfExists('blah')

const getEvents = (req, response) => {
	knex.select().from('events')
		.then(res => response.status(200).json(res))
		.catch(e => console.log(e.stack));
};

const getEventsByYear = (request,response) => {
	const year = parseInt(request.params.year);
  knex.raw(`select * from events where extract(year from events.date) = ?`, [year])
	.then(res =>  response.status(200).json(res.rows))
	.catch(e => console.log(e.stack));
};

const getEventsByMonth = (request,response) => {
	const year = parseInt(request.params.year);
	const month = parseInt(request.params.month);
  knex.raw(`select * from events where extract(year from events.date) = ?
            and extract(month from events.date) = ?`, [year, month])
	.then(res => response.status(200).json(res.rows))
	.catch(e => console.log(e.stack));
};

const getEventsByDay = (request,response) => {
	const year = parseInt(request.params.year);
	const month = parseInt(request.params.month);
	const day = parseInt(request.params.day);
  knex.raw(`select * from events where extract(year from events.date) = ?
            and extract(month from events.date) = ?
            and extract(day from events.date) = ?`,
            [year, month, day])
		.then(res => response.status(200).json(res.rows))
		.catch(e => console.log(e.stack));
};

const createEvent = (request, response) => { //this needs some work for dates and stuff probably
	const { title, description, location, phone, date, start_time, end_time } = request.body;
  knex('events').insert({
    title: title || '',
    description: description || '',
    location: location || '',
    phone: phone || '',
    date,
    start_time,
    end_time
  }, ['*'])
		.then(res => response.status(200).send({
      data: res,
      message: `Event created with event ID ${res[0].event_id}`
		}))
		.catch(e => console.log(e.stack));
  };

// 	// const defaultEventCreateCommand = `
// 	// 	INSERT INTO events (
// 	// 		title,
// 	// 		description,
// 	// 		location,
// 	// 		date,
// 	// 		start_time,
// 	// 		end_time
// 	// 	) 
// 	// 	VALUES(
// 	// 		'test_event',
// 	// 		'testing server and database connection',
// 	// 		'Austin, TX',
// 	// 		CURRENT_DATE,
// 	// 		'2023-04-18 14:11:00-07',
// 	// 		'2023-04-18 15:00:00-07'
// 	// 	)
// 	// `;

const updateEvent = (request, response) => {
  const { event_id, ...rest } = request.body
	// let updateString = ' ';
	// const updateParameters = []
	// const keyValuePairs = Object.entries(rest);
	// for (let i = 0; i < keyValuePairs.length; i++) {
	// 	let key = keyValuePairs[i][0];
	// 	let val = keyValuePairs[i][1];
	// 	updateString += `${key} = $${i+2}, `;
	// 	updateParameters.push(val)
	// };
	// updateString = updateString.slice(0, updateString.length - 2);
  knex('events').where({event_id}).update(rest, ['*'])
		.then(res => response.status(200).send({
      message: `Event with ID: ${event_id} updated`,
      updated: res[0]
    }))
		.catch(e => console.log(e.stack));
};

const deleteEvent = (request, response) => {
	const { event_id } = request.body
  knex('events').where({event_id}).del()
		.then(res => response.status(200).send({
      message: `Event deleted with ID: ${event_id}`,
      id: event_id
    }))
		.catch(e => console.log(e.stack));
};

//deleteTable,
module.exports = {
  getEvents,
  getEventsByYear,
  getEventsByMonth,
	getEventsByDay,
  createEvent,
  updateEvent,
  deleteEvent
};
