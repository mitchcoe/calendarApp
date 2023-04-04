/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('attachments', function (table) {
    table.increments('attachment_id').primary().notNullable();
    table.string('file_type').notNullable();
    table.string('file_name').notNullable();
    table.string('file_path').notNullable();
    table.integer("event_id").notNullable();
    table.foreign('event_id').references('event_id').inTable('events')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('attachments')
};
