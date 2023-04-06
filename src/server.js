const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('./database');
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
    cb(undefined, true); // continue with upload
  }
});

// app.get('/', (request, response) => response.json({ info: 'Node.js, Express, and Postgres API' }));
app.get('/events', db.getEvents);
app.get('/events/:year', db.getEventsByYear);
app.get('/events/:year/:month', db.getEventsByMonth);
app.get('/events/:year/:month/:day', db.getEventsByDay);
app.get('/attachments/:event_id', db.getAttachments);

app.post('/events', db.createEvent);
app.post('/attachments/:event_id', upload.single('file'), db.createAttachment);

app.put('/events', db.updateEvent);

app.delete('/events', db.deleteEvent);
app.delete('/attachments/:attachment_id', db.deleteAttachments)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
