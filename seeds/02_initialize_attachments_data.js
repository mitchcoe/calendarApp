/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('attachments').del()
  await knex('attachments').insert([
    {
      attachment_id: 1,
      file_type: 'image/png',
      file_name: 'logo192.png',
      file_path: 'uploads/1681150298916_logo192.png',
      event_id: 1,
    },
    {
      attachment_id: 2,
      file_type: 'image/png',
      file_name: 'logo192.png',
      file_path: 'uploads/1681150319703_logo192.png',
      event_id: 2,
    },
  ]);
  await knex.raw(`select setval((select pg_get_serial_sequence('"attachments"', 'attachment_id')), (select (max("attachment_id") + 1) from "attachments"), false)`)
};
