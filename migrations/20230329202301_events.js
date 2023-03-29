/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', function (table) {
    table.increments('event_id').primary().notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('location').notNullable();
    table.string('phone').notNullable();
    table.date('date').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events')
};