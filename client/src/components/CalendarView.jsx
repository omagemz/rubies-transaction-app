import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { format } from "date-fns";

const CalendarView = ({ transactions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter transactions for the selected day
  const dailyTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return (
      tDate.getFullYear() === selectedDate.getFullYear() &&
      tDate.getMonth() === selectedDate.getMonth() &&
      tDate.getDate() === selectedDate.getDate()
    );
  });

  const total = dailyTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="mt-5 d-flex flex-column align-items-center">
      <h4 className="text-center">Calendar View</h4>

      <div className="d-flex justify-content-center w-100">
        <div style={{ maxWidth: 380, width: '100%' }}>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>

      <div className="mt-3" style={{ maxWidth: 800, width: '100%' }}>
        <h5 className="text-center">Transactions on {format(selectedDate, "PP")}</h5>
        <p className="text-center">Total: {total} OMR</p>
        <ul className="list-group">
          {dailyTransactions.length === 0 && <li className="list-group-item">No transactions</li>}
          {dailyTransactions.map((t) => (
            <li key={t._id} className="list-group-item">
              {t.amount} OMR {t.description && `- ${t.description}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarView;
