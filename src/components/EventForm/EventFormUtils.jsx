import { useSelector, useDispatch } from 'react-redux'
import { getEvents, createEvents, updateEvents, deleteEvents } from '../../slices/eventSlice';


const createEvent = async (data) => {
  await fetch('/events', {
    method:'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({...data}),
  })
    .then(response => response.json())
    .then(response => {
      useDispatch(createEvents(response.data));
    })
    .catch(error => console.log(error));
};

module.exports = {
  createEvent
};
