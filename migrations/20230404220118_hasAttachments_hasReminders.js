/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
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
exports.down = function(knex) {
  return knex.schema.alterTable('events', function (table) {
    table.dropColumn('hasAttachments');
    table.dropColumn('hasReminders')
  })
};