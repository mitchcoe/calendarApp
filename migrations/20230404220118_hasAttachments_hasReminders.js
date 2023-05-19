/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  let eventsToUpdate = await knex.raw(`select events.event_id from events, attachments
                                        where events.event_id = attachments.event_id`);

  await knex.schema.alterTable('events', function (table) {
    table.boolean('hasAttachments').defaultTo(false).notNullable();
    table.boolean('hasReminders').defaultTo(false).notNullable();
  });

  await knex('events').whereIn('event_id', eventsToUpdate.rows
    .map(event => event.event_id))
    .update({hasAttachments: true});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.alterTable('events', function (table) {
    table.dropColumn('hasAttachments');
  })
};
