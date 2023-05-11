import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import {
    getEvents,
    getEventsByYear,
    getEventsByMonth,
  	getEventsByDay,
    createEvent,
    updateEvent,
    deleteEvent,
    createAttachment,
    getAttachments,
    deleteAttachments,
    getReminders,
    updateReminders,
    getTodaysReminders} from './database.ts'
// const db = require('./database');
const app = express();
const port = 8080;
app.use(express.static('uploads'))

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined || null, true); // continue with upload
  }
});

// @ts-ignore
app.get('/events', getEvents);
app.get('/events/:year', getEventsByYear);
app.get('/events/:year/:month', getEventsByMonth);
app.get('/events/:year/:month/:day', getEventsByDay);
app.get('/attachments/:event_id', getAttachments);
app.get('/reminders/:event_id', getReminders);

app.post('/reminders/today', getTodaysReminders)
app.post('/events', createEvent);
app.post('/attachments/:event_id', upload.single('file'), createAttachment);

app.put('/events', updateEvent);
app.put('/reminders/:event_id', updateReminders);

app.delete('/events', deleteEvent);
app.delete('/attachments/:attachment_id', deleteAttachments)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
