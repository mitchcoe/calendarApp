/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('events').del()

  let timeSetter = (start = true, startTime = 13, day) => {
    let currentDay = new Date();
    currentDay.setUTCHours(start ? startTime : startTime + 1, 0, 0) //13 is for GMT-0500 (Central Daylight Time)
    if(day === 'tomorrow') {
      currentDay.setDate(currentDay.getDate() + 1);
    } else if(day === 'yesterday') {
      currentDay.setDate(currentDay.getDate() - 1);
    }
    return currentDay.toISOString().split('T').join(' ');
  };
  
  const defaultData = [
    {
      title: 'Breakfast today',
      description: 'Eat breakfast',
      location: 'Austin, TX',
      phone: '1234567890',
      date: knex.raw(`CURRENT_DATE`),
      start_time: `${timeSetter()}`,
      end_time: `${timeSetter(false)}`,
    },
    {
      title: 'test_event today',
      description: 'testing server and database connection',
      location: 'Austin, TX',
      phone: '1234567890',
      date: knex.raw(`CURRENT_DATE`),
      start_time: `${timeSetter(true, 15)}`,
      end_time: `${timeSetter(false, 15)}`,
    },
    {
      title: 'test_event tomorrow',
      description: 'testing server and database connection',
      location: 'Austin, TX',
      phone: '',
      date: knex.raw(`CURRENT_DATE + INTERVAL '1 day'`),
      start_time: `${timeSetter(true, 13, 'tomorrow')}`,
      end_time: `${timeSetter(false, 13, 'tomorrow')}`,
    },
    {
      title: 'test_event second tomorrow',
      description: 'testing server and database connection',
      location: 'Austin, TX',
      phone: '',
      date: knex.raw(`CURRENT_DATE + INTERVAL '1 day'`),
      start_time: `${timeSetter(true, 17, 'tomorrow')}`,
      end_time: `${timeSetter(false, 17, 'tomorrow')}`,
    },
    {
      title: 'test_event yesterday',
      description: 'testing server and database connection',
      location: 'Austin, TX',
      phone: '',
      date: knex.raw(`CURRENT_DATE - INTERVAL '1 day'`),
      start_time: `${timeSetter(true, 20, 'yesterday')}`,
      end_time: `${timeSetter(false, 20, 'yesterday')}`,
    },
  ];
  await knex('events').insert(defaultData);
};
