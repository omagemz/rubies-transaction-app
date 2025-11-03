import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice";
import AddTransactionModal from "../components/AddTransactionModal";
import TransactionTable from "../components/TransactionTable";
import { deleteTransaction } from "../services/api";
import CalendarView from "../components/CalendarView";
import ConfirmModal from "../components/ConfirmModal";


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
        <div className="container mt-3">
            <h2 className="text-center fs-4">Rubies Expense Tracker</h2>
            <h4 className={`text-center fs-5 balance ${total < 0 ? 'text-danger' : 'text-success'}`}>Balance: {total} OMR</h4>
            <div className="text-center mb-3">
                <button className="btn btn-primary w-100" onClick={toggleModal}>Add Transaction</button>
            </div>
            <div className="table-responsive">
                <TransactionTable
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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
            <div className="mt-4" style={{ maxWidth: "100%", overflowX: "auto" }}>
                <CalendarView transactions={transactions} />
            </div>
        </div>

    );
};

export default Dashboard;
