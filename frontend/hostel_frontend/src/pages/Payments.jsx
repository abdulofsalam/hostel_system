
import { useEffect, useState } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../api/paymentApi";
import { getStudents } from "../api/studentApi";
import "../styles/Management.css";
import "../styles/Payments.css";

const today = new Date().toLocaleDateString("en-CA");
const currentMonth = `${today.slice(0, 7)}-01`;

const emptyForm = {
  student: "",
  amount: "",
  payment_date: today,
  payment_for_month: currentMonth,
  payment_method: "cash",
  transaction_id: "",
  notes: "",
};

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);

        return `${key}: ${message}`;
      })
      .join(" | ");
  }

  return error?.message || "Something went wrong. Please try again.";
}

function getStudentId(student) {
  return student?.id ?? student;
}

function getStudentLabel(student) {
  return (
    student?.full_name ||
    student?.name ||
    student?.username ||
    `Student #${student?.id}`
  );
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMethod(method) {
  const methods = {
    cash: "Cash",
    bank: "Bank Transfer",
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    card: "Card",
  };

  return methods[method] || method || "Cash";
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [paymentData, studentData] = await Promise.all([
        getPayments(),
        getStudents(),
      ]);

      setPayments(getList(paymentData));
      setStudents(getList(studentData));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.student) {
      setError("Please select a student.");
      return;
    }

    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const wasEditing = editingId !== null;

    const paymentData = {
      student: Number(form.student),
      amount: form.amount,
      payment_date: form.payment_date,
      payment_for_month: `${form.payment_for_month.slice(0, 7)}-01`,
      payment_method: form.payment_method,
      status: "paid",
      transaction_id: form.transaction_id,
      notes: form.notes,
    };

    setSaving(true);

    try {
      if (wasEditing) {
        await updatePayment(editingId, paymentData);
      } else {
        await createPayment(paymentData);
      }

      setForm({ ...emptyForm });
      setEditingId(null);
      setMessage(
        wasEditing
          ? "Payment updated successfully."
          : "Payment recorded successfully."
      );

      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(payment) {
    setEditingId(payment.id);

    setForm({
      student: String(getStudentId(payment.student)),
      amount: String(payment.amount ?? ""),
      payment_date: payment.payment_date ?? today,
      payment_for_month:
        payment.payment_for_month?.slice(0, 7) ?? today.slice(0, 7),
      payment_method: payment.payment_method ?? "cash",
      transaction_id: payment.transaction_id ?? "",
      notes: payment.notes ?? "",
    });

    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(paymentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(paymentId);

    try {
      await deletePayment(paymentId);

      setPayments((previous) =>
        previous.filter((payment) => payment.id !== paymentId)
      );

      setMessage("Payment deleted successfully.");

      if (editingId === paymentId) {
        setForm({ ...emptyForm });
        setEditingId(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return (
    <main className="management-page payments-page">
      <header className="management-header payments-header">
        <div className="payments-header-content">
          <span className="management-eyebrow">FINANCIAL MANAGEMENT</span>
          <h1>Payments Management</h1>
          <p>
            Record student payments, review payment history, and keep track
            of the amounts collected.
          </p>
        </div>

        <button
        type="button"
        className="payments-refresh-btn"
        onClick={loadData}
        disabled={loading}
        >
        {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {error && (
        <div className="payments-alert payments-alert-error" role="alert">
          <span className="payments-alert-icon" aria-hidden="true">!</span>
          <span>{error}</span>
          <button
            type="button"
            className="payments-alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {message && (
        <div className="payments-alert payments-alert-success" role="status">
          <span className="payments-alert-icon" aria-hidden="true">✓</span>
          <span>{message}</span>
          <button
            type="button"
            className="payments-alert-close"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="payments-summary-grid">
        <article className="payments-summary-card payments-summary-blue">
          <div className="payments-summary-top">
            <span>Total Recorded Payments</span>
            <span className="payments-summary-icon" aria-hidden="true">₨</span>
          </div>
          <strong>Rs. {formatAmount(totalPaid)}</strong>
          <p>Total amount across the loaded payment records</p>
        </article>

        <article className="payments-summary-card payments-summary-purple">
          <div className="payments-summary-top">
            <span>Payment Records</span>
            <span className="payments-summary-icon" aria-hidden="true">▤</span>
          </div>
          <strong>{payments.length}</strong>
          <p>Number of recorded payments</p>
        </article>
      </section>

      <section className="management-card payments-form-card">
        <div className="payments-section-heading">
          <div className="payments-heading-icon" aria-hidden="true">
            {editingId !== null ? "✎" : "+"}
          </div>
          <div>
            <h2>{editingId !== null ? "Edit Payment" : "Record a Payment"}</h2>
            <p>
              {editingId !== null
                ? "Update the details of this payment."
                : "Enter the student and payment details below."}
            </p>
          </div>
        </div>

        {students.length === 0 && !loading && (
          <div className="payments-student-notice">
            No students found. Add a student first before recording a payment.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="payments-form-grid">
            <div className="payments-field">
              <label htmlFor="student">Student <span>*</span></label>
              <select
                id="student"
                name="student"
                value={form.student}
                onChange={handleChange}
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {getStudentLabel(student)}
                  </option>
                ))}
              </select>
            </div>

            <div className="payments-field">
              <label htmlFor="amount">Amount (Rs.) <span>*</span></label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                required
              />
            </div>

            <div className="payments-field">
              <label htmlFor="payment_date">Payment Date <span>*</span></label>
              <input
                id="payment_date"
                name="payment_date"
                type="date"
                value={form.payment_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="payments-field">
              <label htmlFor="payment_for_month">
                Month Being Paid For <span>*</span>
              </label>
              <input
                id="payment_for_month"
                name="payment_for_month"
                type="month"
                value={form.payment_for_month.slice(0, 7)}
                onChange={handleChange}
                required
              />
            </div>

            <div className="payments-field">
              <label htmlFor="payment_method">Payment Method <span>*</span></label>
              <select
                id="payment_method"
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                required
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="payments-field">
              <label htmlFor="transaction_id">Transaction ID</label>
              <input
                id="transaction_id"
                name="transaction_id"
                value={form.transaction_id}
                onChange={handleChange}
                placeholder="Optional transaction reference"
              />
              <small>Leave blank for cash payments if not applicable.</small>
            </div>

            <div className="payments-field payments-field-full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional payment details (optional)"
              />
            </div>
          </div>

          <div className="payments-form-actions">
            <button
              type="submit"
              className="management-button payments-save-button"
              disabled={saving || students.length === 0}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Payment"
                  : "Save Payment"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="payments-cancel-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="management-card payments-history-card">
        <div className="payments-section-heading payments-history-heading">
          <div className="payments-heading-icon" aria-hidden="true">▤</div>
          <div>
            <h2>Payment History</h2>
            <p>Review, edit, or delete existing payment records.</p>
          </div>
          <span className="payments-record-count">
            {payments.length} {payments.length === 1 ? "record" : "records"}
          </span>
        </div>

        {loading ? (
          <div className="payments-empty-state">
            <span className="payments-loading-spinner" />
            <p>Loading payment records...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="payments-empty-state">
            <span className="payments-empty-icon" aria-hidden="true">₨</span>
            <h3>No payments recorded yet</h3>
            <p>Once you record a payment, it will appear here.</p>
          </div>
        ) : (
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Month</th>
                  <th>Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="payments-student-cell">
                        <span className="payments-student-avatar" aria-hidden="true">
                          {(payment.student_name || "S").charAt(0).toUpperCase()}
                        </span>
                        <span>
                          {payment.student_name ||
                            `Student #${getStudentId(payment.student)}`}
                        </span>
                      </div>
                    </td>
                    <td>{payment.hostel_name || "—"}</td>
                    <td>{payment.room_number || "—"}</td>
                    <td>
                      <strong className="payments-amount">
                        Rs. {formatAmount(payment.amount)}
                      </strong>
                    </td>
                    <td>{payment.payment_date || "—"}</td>
                    <td>{payment.payment_for_month?.slice(0, 7) || "—"}</td>
                    <td>
                      <span className="payments-method-badge">
                        {formatMethod(payment.payment_method)}
                      </span>
                    </td>
                    <td>
                      <div className="payments-row-actions">
                        <button
                          type="button"
                          className="payments-edit-button"
                          onClick={() => handleEdit(payment)}
                          disabled={deletingId === payment.id || saving}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="payments-delete-button"
                          onClick={() => handleDelete(payment.id)}
                          disabled={deletingId === payment.id || saving}
                        >
                          {deletingId === payment.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
