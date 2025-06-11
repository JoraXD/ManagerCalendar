import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function App() {
  const [date, setDate] = useState(new Date());
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get('/api/tours').then(res => setTours(res.data));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const newTour = {
      date: form.date.value,
      group_size: form.group_size.value,
      venue: form.venue.value,
      customer_id: form.customer_id.value,
    };
    axios.post('/api/tours', newTour).then(() => {
      return axios.get('/api/tours').then(res => setTours(res.data));
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Менеджер экскурсий</h1>
      <Calendar onChange={setDate} value={date} />
      <h2>Экскурсии</h2>
      <ul>
        {tours.map(t => (
          <li key={t.id}>{t.date} - {t.venue}</li>
        ))}
      </ul>
      <h2>Добавить экскурсию</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Дата: <input name="date" type="datetime-local" required /></label>
        </div>
        <div>
          <label>Размер группы: <input name="group_size" type="number" /></label>
        </div>
        <div>
          <label>Место: <input name="venue" /></label>
        </div>
        <div>
          <label>ID заказчика: <input name="customer_id" /></label>
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

export default App;
