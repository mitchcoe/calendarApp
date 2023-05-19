/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('reminders').del()
  await knex('reminders').insert([
    {type: 'email', time_before: '0 30 60', event_id: 1, reminders_on: true},
    {type: 'text', time_before: '0 15 45', event_id: 2, reminders_on: true},
    {type: 'notification', time_before: '0 15 45', event_id: 3, reminders_on: true},
    {type: 'email', time_before: '0 30 60', event_id: 4, reminders_on: true},
    {type: 'email', time_before: '0 30 60', event_id: 5, reminders_on: true},
  ]);
};
