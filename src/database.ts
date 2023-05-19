import { Request, Response } from 'express';
import knexPackage from 'knex';
import fs from 'fs';
import knexConfig from '../knexfile.js'
const knex = knexPackage(knexConfig['development']);

 export const getEvents = async (req = null, response: Response) => {
  try {
    const query = await knex.select().from('events');
    response.status(200).json(query);
  } catch (e: unknown){
    console.log((e as Error).stack)
  }
};

export const getEventsByYear = async (request: Request, response: Response) => {
  try {
    const year = parseInt(request.params.year);
    const query = await knex.raw(`select * from events where extract(year from events.date) = ?`, [year])
    response.status(200).json(query.rows)
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const getEventsByMonth = async (request: Request, response: Response) => {
  try {
    const year = parseInt(request.params.year);
	  const month = parseInt(request.params.month);
    const query = await knex.raw(`select * from events where extract(year from events.date) = ?
                                  and extract(month from events.date) = ?`, [year, month])
    response.status(200).json(query.rows)
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const getEventsByDay = async (request: Request, response: Response) => {
  try {
    const year = parseInt(request.params.year);
	  const month = parseInt(request.params.month);
	  const day = parseInt(request.params.day);
    const query = await knex.raw(`select * from events where extract(year from events.date) = ?
                                  and extract(month from events.date) = ?
                                  and extract(day from events.date) = ?`,
                                  [year, month, day])
    response.status(200).json(query.rows)
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const createReminder = async (reminder: null | object = null) => {
  try {
    let reminderId = await knex('events')
    .whereNotExists(function(this: any) {
      this.select('*').from('reminders').whereRaw('events.event_id = reminders.event_id')
    });
    if(reminder) {
      await knex('reminders').insert({
        ...reminder,
        event_id: reminderId[0].event_id,
      });
    } else {
      await knex('reminders').insert({
        type: 'email',
        time_before: '0 30 60',
        event_id: reminderId[0].event_id,
        reminders_on: true
      });
    }
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const createEvent = async (request: Request, response: Response) => {
  try {
    const { title, description, location, phone, date, start_time, end_time, color, reminder } = request.body;
    const query = await knex('events').insert(
      {
        title: title || '',
        description: description || '',
        location: location || '',
        phone: phone || '',
        date,
        start_time,
        end_time,
        color
      }, ['*']);
    await response.status(200).send({
      data: query,
      message: `Event created with event ID ${query[0].event_id}`
		});
    await createReminder(reminder);
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
  };

export const updateEvent = async (request: Request, response: Response) => {
  try {
    const { event_id, ...rest } = request.body;
    const query = await knex('events').where({event_id}).update(rest, ['*']);
    response.status(200).send({
      message: `Event with ID: ${event_id} updated`,
      // @ts-ignore
      updated: query[0]
    })
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const deleteEvent = async (request: Request, response: Response) => {
  try {
    const { event_id } = request.body
    // @ts-ignore
    const query = await knex.select().from('events', 'attachments').where({event_id}).del()
    response.status(200).send({
      message: `Event deleted with ID: ${event_id}`,
      id: event_id
    })
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const createAttachment = async (request: Request, response: Response) => {
  try {
    const { event_id } = request.params;
    const eventsToUpdate = await knex.raw(`select events.event_id from events, attachments
                                           where events.event_id = attachments.event_id`);
    const query = await knex('attachments').insert({
      file_type: (request.file as Express.Multer.File).mimetype,
      file_name: (request.file as Express.Multer.File).originalname,
      file_path: (request.file as Express.Multer.File).path,
      event_id: parseInt(event_id)
    }, ['*']);
    await response.status(200).send({
      data: query,
      message: `Attachment created with event ID ${query[0].event_id}`
    }); 
    await knex('events').whereIn('event_id', eventsToUpdate).update({hasAttachments: true});
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const getAttachments = async (request: Request, response: Response) => {
  try {
    const { event_id } = request.params
    const query = await knex('attachments').where({event_id: parseInt(event_id)})
    response.status(200).json(query)
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const deleteAttachments = async (request: Request, response: Response) => {
  try {
    const { attachment_id } = request.params;
    const { file_path, event_id } = request.body;
    const query = await knex('attachments').where({attachment_id: parseInt(attachment_id)}).del();
    await response.status(200).send({
      message: `Attachment deleted with ID: ${attachment_id}`,
      id: attachment_id
    });
    const attachmentEventId = await knex('attachments').where({event_id})
    if(attachmentEventId.length === 0) {
      await knex('events').where({event_id}).update({hasAttachments: false})
    }
    await fs.unlink(file_path, (err: Error | null) => {
      if (err) throw err;
      console.log(`${file_path} was deleted`);
    })
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const getReminders = async (request: Request, response: Response) => {
  try {
    const { event_id } = request.params;
    const query = await knex('reminders').where({event_id: parseInt(event_id)})
    response.status(200).json(query[0])
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};

export const getTodaysReminders = async (request: Request, response: Response) => {
  try {
    const { event_ids } = request.body
    const query = knex('reminders').whereIn('event_id', event_ids)
    response.status(200).json(query)
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
}

export const updateReminders = async (request: Request, response: Response) => {
  try {
    const { event_id } = request.params;
    const {...rest} = request.body;
    const query = await knex('reminders').where({event_id}).update(rest, ['*']);
    response.status(200).send({
      message: `Reminder with Event ID: ${event_id} updated`,
      // @ts-ignore
      updated: query[0]
    })
  } catch(e: unknown) {
    console.log((e as Error).stack)
  }
};
