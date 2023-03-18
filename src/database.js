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
	pool.query('SELECT * FROM events WHERE EXTRACT(MONTH FROM events.date) = $1 AND EXTRACT(MONTH FROM events.date) = $2', [year, month])
		.then(res =>  {
			response.status(200).json(res.rows)
		})
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

module.exports = {
	getEvents,
	getEventsByMonth,
	getEventsByYear,
	getEventsByDay
};
