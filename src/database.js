const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'calendarapp',
  password: 'Bobcats#123!',
  port: 5432,
});

const getEvents = (req, response) => {
	pool.query('SELECT * FROM events')
		.then(res =>  response.status(200).json(res.rows))
		.catch(e => console.log(e.stack));
};

const getEventsByYear = (request,response) => {
	const year = parseInt(request.params.year);
	pool.query('SELECT * FROM events WHERE EXTRACT(YEAR FROM events.date) = $1', [year])
	.then(res =>  {
		response.status(200).json(res.rows)
	})
	.catch(e => console.log(e.stack));
};

const getEventsByMonth = (request,response) => {
	const year = parseInt(request.params.month);
	const month = parseInt(request.params.month);
	pool.query(`SELECT * FROM events WHERE EXTRACT(MONTH FROM events.date) = $1 
	AND EXTRACT(MONTH FROM events.date) = $2`,
	[year, month])
	.then(res => response.status(200).json(res.rows))
	.catch(e => console.log(e.stack));
};

const getEventsByDay = (request,response) => {
	const year = parseInt(request.params.month);
	const month = parseInt(request.params.month);
	const day = parseInt(request.params.day);
	pool.query(`SELECT * FROM events WHERE EXTRACT(MONTH FROM events.date) = $1 
							AND EXTRACT(MONTH FROM events.date) = $2 
							AND EXTRACT(DAY FROM events.date) = $3`,
							[year, month, day])
		.then(res =>  {
			response.status(200).json(res.rows)
		})
		.catch(e => console.log(e.stack));
};

const createEvent = (request, response) => { //this needs some work for dates and stuff probably
	// console.log(request.body)
	const { title, description, location, phone, date, start_time, end_time } = request.body;
	pool.query(`
		INSERT INTO events (
			title,
			description,
			location,
      phone,
			date,
			start_time,
			end_time
		) 
		VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
		[title || '', description || '', location || '', phone || '', date, start_time, end_time])
		.then(res => response.status(200).send({
			data: res.rows,
			message: `Event created with event ID ${res.rows[0].event_id}`
		}))
		.catch(e => console.log(e.stack));

	// const defaultEventCreateCommand = `
	// 	INSERT INTO events (
	// 		title,
	// 		description,
	// 		location,
	// 		date,
	// 		start_time,
	// 		end_time
	// 	) 
	// 	VALUES(
	// 		'test_event',
	// 		'testing server and database connection',
	// 		'Austin, TX',
	// 		CURRENT_DATE,
	// 		'2023-04-18 14:11:00-07',
	// 		'2023-04-18 15:00:00-07'
	// 	)
	// `;
};
	

const updateEvent = (request, response) => {
  const { event_id, ...rest } = request.body
	let updateString = ' ';
	const updateParameters = []
	const keyValuePairs = Object.entries(rest);
	for (let i = 0; i < keyValuePairs.length; i++) {
		let key = keyValuePairs[i][0];
		let val = keyValuePairs[i][1];
		updateString += `${key} = $${i+2}, `;
		updateParameters.push(val)
	};
	updateString = updateString.slice(0, updateString.length - 2);
  pool.query(
    `UPDATE events SET${updateString} WHERE event_id = $1 RETURNING *`,
    [event_id, ...updateParameters],
  )
		.then(res => response.status(200).send({message: `Event with ID: ${event_id} updated`, updated: res.rows[0]}))
		.catch(e => console.log(e.stack));
};

const deleteEvent = (request, response) => {
	const { event_id } = request.body
	pool.query(`DELETE FROM events WHERE event_id = $1`, [event_id])
		.then(res => response.status(200).send({message: `Event deleted with ID: ${event_id}`, id: event_id}))
		.catch(e => console.log(e.stack));
};

module.exports = {
	getEvents,
	getEventsByMonth,
	getEventsByYear,
	getEventsByDay,
	createEvent,
	updateEvent,
	deleteEvent
};
