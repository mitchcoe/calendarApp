const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'calendarapp',
  password: 'Bobcats#123!',
  port: 5432,
});
