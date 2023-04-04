/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('attachments').del()
  await knex('attachments').insert([
    {
      attachment_id: 1,
      file_type: 'image/png',
      file_name: 'logo192 copy.png',
      file_path: 'uploads/1680643462405_logo192 copy.png',
      event_id: 1,
    },
  ]);
};