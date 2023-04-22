/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.dropForeign('event_id');

    table.foreign('event_id')
      .references('event_id')
      .inTable('events')
      .onDelete('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.dropForeign('event_id');

    table.foreign('event_id')
      .references('event_id')
      .inTable('events')
  })
};
