import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.dropForeign('event_id');

    table.foreign('event_id')
      .references('event_id')
      .inTable('events')
      .onDelete('CASCADE');
  })
};

export async function down(knex: Knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.dropForeign('event_id');

    table.foreign('event_id')
      .references('event_id')
      .inTable('events');
  })
};
