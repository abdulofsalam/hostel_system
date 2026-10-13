
import { useEffect, useState } from "react";
import {
  getHostels,
  createHostel,
  deleteHostel,
} from "../api/hosteApi";
import "../styles/Management.css";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadHostels() {
    setLoading(true);
    setError("");

    try {
      const data = await getHostels();
      const list = Array.isArray(data) ? data : data?.results;

      if (!Array.isArray(list)) {
        throw new Error("The API did not return a hostel list.");
      }

      setHostels(list);
    } catch (err) {
      console.error("Load hostels failed:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to load hostels."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHostels();
  }, []);

  async function handleAddHostel(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await createHostel({
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
      });

      setName("");
      setAddress("");
      setPhone("");
      setMessage("Hostel added successfully.");

      await loadHostels();
    } catch (err) {
      console.error("Add hostel failed:", err);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteHostel(id) {
    if (!window.confirm("Are you sure you want to delete this hostel?")) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingId(id);

    try {
      await deleteHostel(id);
      setHostels((previous) =>
        previous.filter((hostel) => hostel.id !== id)
      );
      setMessage("Hostel deleted successfully.");
    } catch (err) {
      console.error("Delete hostel failed:", err);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="management-page">
      <header className="management-header">
        <div className="management-header-content">
          <span className="management-eyebrow">HOSTEL MANAGEMENT</span>
          <h1>Manage Hostels</h1>
          <p>
            Organize your hostel properties, keep their details up to date,
            and manage everything from one workspace.
          </p>
        </div>
        <div className="management-header-icon" aria-hidden="true">
          ⌂
        </div>
      </header>

      <section className="management-stats">
        <article className="management-stat">
          <div className="management-stat-icon">⌂</div>
          <div>
            <p className="management-stat-label">Your Hostels</p>
            <p className="management-stat-value">
              {loading ? "—" : hostels.length}
            </p>
          </div>
        </article>

        <article className="management-stat">
          <div className="management-stat-icon">✓</div>
          <div>
            <p className="management-stat-label">Management</p>
            <p className="management-stat-value">Active</p>
          </div>
        </article>
      </section>

      {error && (
        <div className="management-alert management-alert-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div
          className="management-alert management-alert-success"
          role="status"
        >
          {message}
        </div>
      )}

      <div className="management-grid">
        <section className="management-panel">
          <div className="management-panel-heading">
            <div className="management-panel-heading-icon">＋</div>
            <div>
              <h2>Add New Hostel</h2>
              <p>Enter the details of your property.</p>
            </div>
          </div>

          <form onSubmit={handleAddHostel}>
            <div className="management-field">
              <label className="management-label" htmlFor="hostel-name">
                Hostel Name
              </label>
              <input
                className="management-input"
                id="hostel-name"
                placeholder="e.g. City Residence"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={150}
              />
            </div>

            <div className="management-field">
              <label className="management-label" htmlFor="hostel-address">
                Full Address
              </label>
              <textarea
                className="management-input management-textarea"
                id="hostel-address"
                placeholder="Enter the hostel address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="management-field">
              <label className="management-label" htmlFor="hostel-phone">
                Contact Number
              </label>
              <input
                className="management-input"
                id="hostel-phone"
                type="tel"
                placeholder="Enter contact number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              className="management-primary-button"
              type="submit"
              disabled={saving}
            >
              {saving ? "Adding hostel..." : "＋ Add Hostel"}
            </button>
          </form>
        </section>

        <section className="management-panel">
          <div className="management-list-heading">
            <div className="management-panel-heading" style={{ margin: 0 }}>
              <div className="management-panel-heading-icon">⌂</div>
              <div>
                <h2>Your Hostels</h2>
                <p>Properties associated with your account.</p>
              </div>
            </div>

            <button
              className="management-refresh-button"
              type="button"
              onClick={loadHostels}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="management-muted">Loading your hostels...</p>
          ) : hostels.length === 0 ? (
            <div className="management-empty">
              <div className="management-empty-icon">⌂</div>
              <h3>No hostels yet</h3>
              <p>
                Add your first hostel using the form. Your saved properties
                will appear here.
              </p>
            </div>
          ) : (
            <div className="management-card-list">
              {hostels.map((hostel) => (
                <article className="management-item-card" key={hostel.id}>
                  <div className="management-item-top">
                    <div className="management-item-icon">⌂</div>
                    <div className="management-item-main">
                      <h3>{hostel.name}</h3>
                      <p className="management-item-subtitle">
                        Hostel ID: #{hostel.id}
                      </p>
                    </div>
                  </div>

                  <div className="management-item-details">
                    <div className="management-detail">
                      <span className="management-detail-icon">⌖</span>
                      <span>
                        {hostel.address || "Address not provided"}
                      </span>
                    </div>
                    <div className="management-detail">
                      <span className="management-detail-icon">☎</span>
                      <span>
                        {hostel.phone || "Phone not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="management-item-actions">
                    <button
                      className="management-delete-button"
                      type="button"
                      onClick={() => handleDeleteHostel(hostel.id)}
                      disabled={deletingId === hostel.id}
                    >
                      {deletingId === hostel.id
                        ? "Deleting..."
                        : "⌫ Delete Hostel"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
