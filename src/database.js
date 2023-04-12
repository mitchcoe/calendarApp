const fs = require('fs');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development'])

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
  knex.select().from('events', 'attachments').where({event_id}).del()
		.then(res => response.status(200).send({
      message: `Event deleted with ID: ${event_id}`,
      id: event_id
    }))
		.catch(e => console.log(e.stack));
};

const createAttachment = (request, response) => {
  const { event_id } = request.params
  let eventsToUpdate = knex.raw(`select events.event_id from events, attachments
                                  where events.event_id = attachments.event_id`)
  knex('attachments').insert({
    file_type: request.file.mimetype,
    file_name: request.file.originalname,
    file_path: request.file.path,
    event_id: parseInt(event_id)
  }, ['*'])
  .then(res => response.status(200).send({
    data: res,
    message: `Attachment created with event ID ${res[0].event_id}`
  }))
  .then(() => knex('events').whereIn('event_id', eventsToUpdate).update({hasAttachments: true}))
  .catch(e => console.log(e.stack));
};

const getAttachments = (request, response) => {
  const { event_id } = request.params
  knex('attachments').where({event_id: parseInt(event_id)})
    .then(res => response.status(200).json(res))
    .catch(e => console.log(e.stack));
};

const deleteAttachments = (request, response) => {
  const { attachment_id } = request.params;
  const { file_path, event_id } = request.body;

  knex('attachments').where({attachment_id: parseInt(attachment_id)}).del()
    .then(res => response.status(200).send({
      message: `Attachment deleted with ID: ${attachment_id}`,
      id: attachment_id
    }))
    .then(() => knex('attachments').where({event_id}))
    .then((res) => {
      if(res.length === 0) {
        return knex('events').where({event_id}).update({hasAttachments: false})
      }
      return;
    })
    .then(() => {
      fs.unlink(file_path, (err) => {
        if (err) throw err;
        console.log(`${file_path} was deleted`);
      })
    })
    .catch(e => console.log(e.stack));
};

const getReminders = (request, response) => {
  const { event_id } = request.params;
  knex('reminders').where({event_id: parseInt(event_id)})
    .then(res => response.status(200).json(res[0]))
    .catch(e => console.log(e.stack));
};

const getTodaysReminders = (request, response) => {
  let { event_ids } = request.body
  knex('reminders').whereIn('event_id', event_ids)
  .then(res => response.status(200).json(res))
  .catch(e => console.log(e.stack));
}

const updateReminders = (request, response) => {
  const { event_id } = request.params;
  const {...rest} = request.body

  knex('reminders').where({event_id}).update(rest, ['*'])
    .then(res => response.status(200).send({
      message: `Reminder with Event ID: ${event_id} updated`,
      updated: res[0]
    }))
    .catch(e => console.log(e.stack));
};

module.exports = {
  getEvents,
  getEventsByYear,
  getEventsByMonth,
	getEventsByDay,
  createEvent,
  updateEvent,
  deleteEvent,
  createAttachment,
  getAttachments,
  deleteAttachments,
  getReminders,
  updateReminders,
  getTodaysReminders,
};
