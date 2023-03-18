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
	const { title, description, location, date, start_time, end_time } = request.body;
	pool.query(`
		INSERT INTO events (
			title,
			description,
			location,
			date,
			start_time,
			end_time
		) 
		VALUES($1, $2, $3, $4, $5)`, 
		[title, description, location, date, start_time, end_time])
		.then(res => response.status(200).send(`Event created`))
		.catch(e => console.log(e.stack));

	const defaultEvent = `
		INSERT INTO events (
			title,
			description,
			location,
			date,
			start_time,
			end_time
		) 
		VALUES(
			'test_event',
			'testing server and database connection',
			'Austin, TX',
			CURRENT_DATE,
			'2023-04-18 14:11:00-07',
			'2023-04-18 15:00:00-07'
		)
	`;
}
	

const updateEvent = (request, response) => { //is there a way to dynamically pick columns? also dont use this right now
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE events SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Event modified with ID: ${id}`)
    }
  )
}

const deleteEvent = (request, response) => { // needs work
	const id = parseInt(request.params.id);
	pool.query(`DELETE FROM events WHERE events_id = $1`, [id])
	.then(res => response.status(200).send(`Event deleted with ID: ${id}`))
}

module.exports = {
	getEvents,
	getEventsByMonth,
	getEventsByYear,
	getEventsByDay,
	createEvent,
	updateEvent,
	deleteEvent
};
