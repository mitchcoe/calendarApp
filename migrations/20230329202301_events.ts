import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('events', (table) => {
    table.increments('event_id').primary().notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('location').notNullable();
    table.string('phone').notNullable();
    table.date('date').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.string('color').defaultTo('#2196f3');
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('events')
};