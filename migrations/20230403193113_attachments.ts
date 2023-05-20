import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('attachments', (table) => {
    table.increments('attachment_id').primary().notNullable();
    table.string('file_type').notNullable();
    table.string('file_name').notNullable();
    table.string('file_path').notNullable();
    table.integer("event_id").notNullable();
    table.foreign('event_id').references('event_id').inTable('events')
  })
};

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('attachments')
};
