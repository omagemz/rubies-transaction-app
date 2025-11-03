import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice";
import AddTransactionModal from "../components/AddTransactionModal";
import TransactionTable from "../components/TransactionTable";
import { deleteTransaction } from "../services/api";
import CalendarView from "../components/CalendarView";
import ConfirmModal from "../components/ConfirmModal";
import ThemeToggle from "../components/ThemeToggle";

const Dashboard = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.list);

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (!modalOpen) setEditData(null);
    };

    const handleEdit = (transaction) => {
        setEditData(transaction);
        setModalOpen(true);
    };

    const openDeleteConfirm = (id) => {
        setToDeleteId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async (id) => {
        openDeleteConfirm(id);
    };

    const handleDeleteConfirmed = async () => {
        if (!toDeleteId) return;
        setIsDeleting(true);
        try {
            await deleteTransaction(toDeleteId);
            dispatch(fetchTransactions());
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setIsDeleting(false);
            setConfirmOpen(false);
            setToDeleteId(null);
        }
    };

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="container">
            {/* Header */}
            <div className="app-header">
                <h1 className="app-title">💎 Rubies</h1>
                <ThemeToggle />
            </div>

            {/* Balance Card */}
            <div className="balance-card">
                <div className="balance-label">Current Balance</div>
                <div className={`balance-amount ${total >= 0 ? 'positive' : 'negative'}`}>
                    {total.toFixed(2)} OMR
                </div>
                <div style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Add Transaction Button */}
            <button className="btn btn-primary btn-add" onClick={toggleModal}>
                ➕ Add Transaction
            </button>

            {/* Transactions Table */}
            <div className="table-container">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>📊 Transactions</h3>
                <TransactionTable
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modals */}
            <AddTransactionModal isOpen={modalOpen} toggle={toggleModal} editData={editData} />
            <ConfirmModal
                isOpen={confirmOpen}
                toggle={() => setConfirmOpen(false)}
                title="Delete transaction"
                message="Are you sure you want to permanently delete this transaction? This action cannot be undone."
                onConfirm={handleDeleteConfirmed}
                isLoading={isDeleting}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Calendar View */}
            <div className="calendar-container">
                <CalendarView transactions={transactions} />
            </div>
        </div>
    );
};

export default Dashboard;
