/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reminders').del()
  await knex('reminders').insert([
    {type: 'email', time_before: '60', event_id: 1, reminders_on: true},
    {type: 'text', time_before: '45', event_id: 2, reminders_on: true},
  ]);
};
