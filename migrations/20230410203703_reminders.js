/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('reminders', function (table) {
    table.increments('reminder_id').primary().notNullable();
    table.string('type').notNullable();
    table.string('time_before').notNullable();
    table.boolean('reminders_on').defaultsTo(true).notNullable()
    table.integer("event_id").notNullable();
    table.foreign('event_id').references('event_id').inTable('events').onDelete('CASCADE')
  });
  await knex.schema.alterTable('events', function (table) {
    table.dropColumn('hasReminders');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('reminders')
};
