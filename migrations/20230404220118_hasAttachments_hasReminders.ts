import type { Knex } from 'knex';
import type { Event } from '../src/globalTypes'

export async function up(knex: Knex) {
  let eventsToUpdate = await knex.raw(`select events.event_id from events, attachments
                                        where events.event_id = attachments.event_id`);

  await knex.schema.alterTable('events', (table) => {
    table.boolean('hasAttachments').defaultTo(false).notNullable();
    table.boolean('hasReminders').defaultTo(false).notNullable();
  });

  await knex('events').whereIn('event_id', eventsToUpdate.rows
    .map((event: Event) => event.event_id))
    .update({hasAttachments: true});
};

export async function down(knex: Knex) {
  return knex.schema.alterTable('events', (table) => {
    table.dropColumn('hasAttachments');
  })
};
