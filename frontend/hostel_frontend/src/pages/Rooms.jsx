
import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  deleteRoom,
} from "../api/rooApi";
import { getHostels } from "../api/hosteApi";
import "../styles/Management.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [roomData, hostelData] = await Promise.all([
        getRooms(),
        getHostels(),
      ]);

      const roomList = Array.isArray(roomData)
        ? roomData
        : roomData?.results;

      const hostelList = Array.isArray(hostelData)
        ? hostelData
        : hostelData?.results;

      if (!Array.isArray(roomList) || !Array.isArray(hostelList)) {
        throw new Error("The API returned an unexpected response.");
      }

      setRooms(roomList);
      setHostels(hostelList);
    } catch (err) {
      console.error("Load rooms error:", err);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddRoom(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!hostel) {
      setError("Please select a hostel.");
      return;
    }

    if (Number(monthlyRent) < 0) {
      setError("Monthly rent cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      await createRoom({
        hostel: Number(hostel),
        room_number: roomNumber.trim(),
        monthly_rent: Number(monthlyRent),
      });

      setRoomNumber("");
      setMonthlyRent("");
      setMessage("Room added successfully.");

      await loadData();
    } catch (err) {
      console.error("Create room error:", err);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRoom(id) {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingId(id);

    try {
      await deleteRoom(id);
      setRooms((previous) => previous.filter((room) => room.id !== id));
      setMessage("Room deleted successfully.");
    } catch (err) {
      console.error("Delete room error:", err);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setDeletingId(null);
    }
  }

  function getHostelName(room) {
    const hostelId =
      typeof room.hostel === "object"
        ? room.hostel?.id
        : room.hostel;

    const matchingHostel = hostels.find(
      (item) => String(item.id) === String(hostelId)
    );

    return (
      room.hostel_name ||
      (typeof room.hostel === "object" ? room.hostel?.name : "") ||
      matchingHostel?.name ||
      `Hostel #${hostelId ?? "unknown"}`
    );
  }

  const totalRent = rooms.reduce(
    (total, room) => total + Number(room.monthly_rent || 0),
    0
  );

  return (
    <main className="management-page">
      <header className="management-header">
        <div className="management-header-content">
          <span className="management-eyebrow">ROOM MANAGEMENT</span>
          <h1>Manage Rooms</h1>
          <p>
            Create rooms, assign them to your hostels, and keep monthly
            rental information organized in one place.
          </p>
        </div>
        <div className="management-header-icon" aria-hidden="true">
          ▤
        </div>
      </header>

      <section className="management-stats">
        <article className="management-stat">
          <div className="management-stat-icon">▤</div>
          <div>
            <p className="management-stat-label">Total Rooms</p>
            <p className="management-stat-value">
              {loading ? "—" : rooms.length}
            </p>
          </div>
        </article>

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
          <div className="management-stat-icon">₨</div>
          <div>
            <p className="management-stat-label">Combined Monthly Rent</p>
            <p
              className="management-stat-value"
              style={{ fontSize: "18px", overflowWrap: "anywhere" }}
            >
              {loading
                ? "—"
                : `Rs. ${totalRent.toLocaleString("en-PK", {
                    maximumFractionDigits: 2,
                  })}`}
            </p>
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
              <h2>Add New Room</h2>
              <p>Choose a hostel and enter the room details.</p>
            </div>
          </div>

          {hostels.length === 0 && !loading && (
            <div className="management-alert management-alert-error">
              You need to create a hostel before adding rooms.
            </div>
          )}

          <form onSubmit={handleAddRoom}>
            <div className="management-field">
              <label className="management-label" htmlFor="room-hostel">
                Select Hostel
              </label>
              <select
                className="management-input"
                id="room-hostel"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                required
                disabled={loading || hostels.length === 0}
              >
                <option value="">Choose a hostel</option>
                {hostels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="management-field">
              <label className="management-label" htmlFor="room-number">
                Room Number
              </label>
              <input
                className="management-input"
                id="room-number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 101 or A-02"
                required
                maxLength={50}
              />
            </div>

            <div className="management-field">
              <label className="management-label" htmlFor="room-rent">
                Monthly Rent (Rs.)
              </label>
              <input
                className="management-input"
                id="room-rent"
                type="number"
                min="0"
                step="0.01"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 15000"
                required
              />
            </div>

            <button
              className="management-primary-button"
              type="submit"
              disabled={saving || loading || hostels.length === 0}
            >
              {saving ? "Adding room..." : "＋ Add Room"}
            </button>
          </form>
        </section>

        <section className="management-panel">
          <div className="management-list-heading">
            <div className="management-panel-heading" style={{ margin: 0 }}>
              <div className="management-panel-heading-icon">▤</div>
              <div>
                <h2>Your Rooms</h2>
                <p>Rooms registered under your hostels.</p>
              </div>
            </div>

            <button
              className="management-refresh-button"
              type="button"
              onClick={loadData}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="management-muted">Loading your rooms...</p>
          ) : rooms.length === 0 ? (
            <div className="management-empty">
              <div className="management-empty-icon">▤</div>
              <h3>No rooms yet</h3>
              <p>
                Add your first room using the form. Remember to select the
                hostel to which it belongs.
              </p>
            </div>
          ) : (
            <div className="management-card-list">
              {rooms.map((room) => (
                <article className="management-item-card" key={room.id}>
                  <div className="management-item-top">
                    <div className="management-item-icon">▤</div>
                    <div className="management-item-main">
                      <h3>Room {room.room_number}</h3>
                      <p className="management-item-subtitle">
                        Room ID: #{room.id}
                      </p>
                    </div>
                  </div>

                  <div className="management-item-details">
                    <div className="management-detail">
                      <span className="management-detail-icon">⌂</span>
                      <span>{getHostelName(room)}</span>
                    </div>

                    <div className="management-detail">
                      <span className="management-detail-icon">₨</span>
                      <span>
                        Monthly rent: Rs.{" "}
                        {Number(room.monthly_rent || 0).toLocaleString(
                          "en-PK",
                          { maximumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="management-item-actions">
                    <button
                      className="management-delete-button"
                      type="button"
                      onClick={() => handleDeleteRoom(room.id)}
                      disabled={deletingId === room.id}
                    >
                      {deletingId === room.id
                        ? "Deleting..."
                        : "⌫ Delete Room"}
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
