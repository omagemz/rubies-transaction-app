import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import { fetchTransactions } from "../features/transactionsSlice";
import { addTransaction, updateTransaction } from "../services/api";

const AddTransactionModal = ({ isOpen, toggle, editData }) => {
  const [amount, setAmount] = useState(editData ? Math.abs(Number(editData.amount)) : "");
  const [description, setDescription] = useState(editData ? editData.description : "");
  const [type, setType] = useState(editData ? (Number(editData.amount) < 0 ? "expense" : "income") : "expense");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setAmount(Math.abs(Number(editData.amount)));
      setDescription(editData.description || "");
      setType(Number(editData.amount) < 0 ? "expense" : "income");
    } else {
      setAmount("");
      setDescription("");
      setType("expense");
    }
  }, [editData, isOpen]);

  const descRef = useRef(null);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      alert("Please enter an amount greater than 0");
      return;
    }

    // convert sign according to type: expense => negative
    const finalAmount = type === "expense" ? -Math.abs(amt) : Math.abs(amt);

    setIsSubmitting(true);
    try {
      if (editData) {
        await updateTransaction(editData._id, { amount: finalAmount, description });
      } else {
        await addTransaction({ amount: finalAmount, description });
      }
      dispatch(fetchTransactions());
      toggle();
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{editData ? "Edit Transaction" : "Add Transaction"}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup tag="fieldset">
            <Label>Type</Label>
            <div>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="type"
                  id="typeIncome"
                  value="income"
                  checked={type === "income"}
                  onChange={() => setType("income")}
                  disabled={isSubmitting}
                />
                <Label for="typeIncome" check className="ms-1">Income</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="type"
                  id="typeExpense"
                  value="expense"
                  checked={type === "expense"}
                  onChange={() => setType("expense")}
                  disabled={isSubmitting}
                />
                <Label for="typeExpense" check className="ms-1">Expense</Label>
              </FormGroup>
            </div>
          </FormGroup>
          <FormGroup>
            <Label>Description (Optional)</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              innerRef={descRef}
            />

            <div className="mt-2">
              <small className="text-muted">Quick add:</small>
              <div className="mt-1">
                {['🚬Cigarettes','🍔Talabat','🍹Drinks'].map((p) => (
                  <Button
                    key={p}
                    color="light"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => {
                      setDescription(p);
                      // focus the input
                      if (descRef.current && typeof descRef.current.focus === 'function') descRef.current.focus();
                    }}
                    disabled={isSubmitting}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : editData ? "Update" : "Add"}
        </Button>{" "}
        <Button color="secondary" onClick={toggle} disabled={isSubmitting}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTransactionModal;
