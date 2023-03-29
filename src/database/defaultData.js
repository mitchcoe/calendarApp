let timeSetter = (start = true, startTime = 13, day) => {
  let currentDay = new Date();
  currentDay.setUTCHours(start ? 13 : 14, 0, 0) //13 is for GMT-0500 (Central Daylight Time)
  if(day === 'tomorrow') {
    currentDay.setDate(currentDay.getDate() + 1);
  } else if(day === 'yesterday') {
    currentDay.setDate(currentDay.getDate() - 1);
  }
  return currentDay.toISOString()
}

const defaultData = [
  {
    title: 'Breakfast',
    description: 'Eat breakfast',
    location: 'Austin, TX',
    phone: '1234567890',
    date: 'CURRENT_DATE',
    start_time: `${() => timeSetter()}`,
    end_time: `${() => timeSetter(false)}`,
  },
  {
    title: 'test_event',
    description: 'testing server and database connection',
    location: 'Austin, TX',
    phone: '1234567890',
    date: 'CURRENT_DATE',
    start_time: `${() => timeSetter(true, 15)}`,
    end_time: `${() => timeSetter(false)}`,
  },
  {
    title: 'test_event',
    description: 'testing server and database connection',
    location: 'Austin, TX',
    phone: '',
    date: 'CURRENT_DATE',
    start_time: `${() => timeSetter(true, 13, 'tomorrow')}`,
    end_time: `${() => timeSetter(false)}`,
  },
  {
    title: 'test_event',
    description: 'testing server and database connection',
    location: 'Austin, TX',
    phone: '',
    date: 'CURRENT_DATE',
    start_time: `${() => timeSetter(true, 17, 'tomorrow')}`,
    end_time: `${() => timeSetter(false)}`,
  },
  {
    title: 'test_event',
    description: 'testing server and database connection',
    location: 'Austin, TX',
    phone: '',
    date: 'CURRENT_DATE',
    start_time: `${() => timeSetter(true, 20, 'yesterday')}`,
    end_time: `${() => timeSetter(false)}`,
  },
];

module.exports = {
  defaultData
};
