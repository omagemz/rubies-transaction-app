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
    <div className="calendar-container">
      <h4 className="text-center mb-4">📅 Calendar View</h4>

      <div className="d-flex justify-content-center w-100 mb-4">
        <div style={{ maxWidth: 380, width: '100%' }}>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>

      <div className="calendar-transactions">
        <h5 className="text-center mb-3">Transactions on {format(selectedDate, "PP")}</h5>
        <p className={`text-center fw-bold fs-5 mb-3 ${total < 0 ? 'text-danger' : 'text-success'}`}>
          Total: {total.toFixed(2)} OMR
        </p>
        <ul className="list-group">
          {dailyTransactions.length === 0 && (
            <li className="list-group-item text-center text-muted">No transactions for this day</li>
          )}
          {dailyTransactions.map((t) => (
            <li key={t._id} className={`list-group-item d-flex justify-content-between align-items-center ${Number(t.amount) < 0 ? 'border-start border-danger border-3' : 'border-start border-success border-3'}`}>
              <div>
                <strong className={Number(t.amount) < 0 ? 'text-danger' : 'text-success'}>
                  {Number(t.amount) < 0 ? '−' : '+'}{Math.abs(t.amount).toFixed(2)} OMR
                </strong>
                {t.description && <div className="text-muted small">{t.description}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarView;
