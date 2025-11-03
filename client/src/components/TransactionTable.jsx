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
            {sorted.map((t) => (
              <tr key={t._id}>
                <td className={Number(t.amount) < 0 ? 'text-danger' : 'text-success'}>{t.amount} OMR</td>
                <td>{t.description || '-'}</td>
                <td>{t.date ? new Date(t.date).toLocaleString() : '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit && onEdit(t)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete && onDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="d-block d-sm-none">
        {sorted.map((t) => (
          <div className="card mb-2 p-2 transaction-card" key={t._id}>
            <div className="d-flex justify-content-between align-items-start">
              <strong className={Number(t.amount) < 0 ? 'text-danger' : 'text-success'}>{t.amount} OMR</strong>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit && onEdit(t)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete && onDelete(t._id)}>Delete</button>
              </div>
            </div>
            <p className="mb-1">{t.description || '-'}</p>
            <small className="text-muted">{t.date ? new Date(t.date).toLocaleString() : '-'}</small>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionTable;
