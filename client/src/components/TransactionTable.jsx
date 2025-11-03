import React, { useMemo, useState } from 'react';

const TransactionTable = ({ transactions = [], onEdit, onDelete }) => {
  if (!Array.isArray(transactions)) return null;

  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount'
  const [order, setOrder] = useState('desc'); // 'asc' | 'desc'

  const sorted = useMemo(() => {
    const copy = [...transactions];
    if (sortBy === 'date') {
      copy.sort((a, b) => {
        const ta = a.date ? new Date(a.date).getTime() : 0;
        const tb = b.date ? new Date(b.date).getTime() : 0;
        return order === 'asc' ? ta - tb : tb - ta;
      });
    } else if (sortBy === 'amount') {
      copy.sort((a, b) => {
        const ta = Number(a.amount) || 0;
        const tb = Number(b.amount) || 0;
        return order === 'asc' ? ta - tb : tb - ta;
      });
    }
    return copy;
  }, [transactions, sortBy, order]);

  const toggleOrder = () => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <label className="me-2 mb-0">Sort by:</label>
          <select className="form-select form-select-sm me-2" style={{ width: 140 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <button className="btn btn-sm btn-outline-secondary" onClick={toggleOrder} title="Toggle order">
            {sortBy === 'date' ? (order === 'desc' ? 'New → Old' : 'Old → New') : (order === 'desc' ? 'High → Low' : 'Low → High')}
          </button>
        </div>
        <div className="text-muted small">{sorted.length} items</div>
      </div>
      {/* Desktop / larger screens: table */}
      <div className="d-none d-sm-block">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const isExpense = Number(t.amount) < 0;
              const rowClass = isExpense ? 'expense-row' : 'income-row';
              return (
                <tr key={t._id} className={rowClass}>
                  <td>
                    <strong>{isExpense ? '−' : '+'}{Math.abs(t.amount).toFixed(2)} OMR</strong>
                  </td>
                  <td>{t.description || 'No description'}</td>
                  <td>{t.date ? new Date(t.date).toLocaleString() : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit && onEdit(t)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete && onDelete(t._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="d-block d-sm-none">
        {sorted.map((t) => (
          <div className="card transaction-card" key={t._id}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <strong className={`fs-5 ${Number(t.amount) < 0 ? 'text-danger' : 'text-success'}`}>
                  {Number(t.amount) < 0 ? '−' : '+'}{Math.abs(t.amount).toFixed(2)} OMR
                </strong>
                <p className="mb-0 mt-1">{t.description || 'No description'}</p>
                <small className="text-muted">{t.date ? new Date(t.date).toLocaleDateString() : '-'}</small>
              </div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit && onEdit(t)}>
                ✏️ Edit
              </button>
              <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => onDelete && onDelete(t._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionTable;
