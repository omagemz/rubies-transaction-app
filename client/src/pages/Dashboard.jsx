import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice.js";
import AddTransactionModal from "../components/AddTransactionModal.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { deleteTransaction } from "../services/api.js";
import CalendarView from "../components/CalendarView.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";


const Dashboard = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.list);

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (!modalOpen) setEditData(null); // reset edit data when opening new
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
        // legacy: open confirm modal
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
            <div className="text-center mb-3">
                <h1 className="fs-3 fw-bold mb-2">Rupies Tracker</h1>
                <div className={`balance ${total < 0 ? 'text-danger' : 'text-success'}`}>
                    Balance: {total.toFixed(2)} OMR
                </div>
            </div>
            
            <div className="mb-3 text-center">
                <button className="btn btn-primary btn-add" onClick={toggleModal}>
                    ➕ Add Transaction
                </button>
            </div>
            
            <div className="mb-4">
                <TransactionTable
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <div className="text-center mb-4">
                <button 
                    className="btn btn-outline-primary" 
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    {showCalendar ? '📅 Hide Calendar View' : '📅 Show Calendar View'}
                </button>
            </div>
            
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
            
            {showCalendar && (
                <div className="mt-5">
                    <CalendarView transactions={transactions} />
                </div>
            )}
        </div>

    );
};

export default Dashboard;
