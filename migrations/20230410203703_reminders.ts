import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('reminders', (table) => {
    table.increments('reminder_id').primary().notNullable();
    table.string('type').notNullable();
    table.string('time_before').notNullable();
    table.boolean('reminders_on').defaultTo(true).notNullable()
    table.integer("event_id").notNullable();
    table.foreign('event_id').references('event_id').inTable('events').onDelete('CASCADE')
  });
  await knex.schema.alterTable('events', (table) => {
    table.dropColumn('hasReminders');
  })
};

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('reminders');
};
