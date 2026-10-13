
import { useEffect, useState } from "react";
import { getRooms, updateRoom } from "../api/rooApi";
import "../styles/Occupancy.css";

function getList(data) {
  if (Array.isArray(data)) return data;
  return data?.results || [];
}

function getAvailableBeds(room) {
  const capacity = Number(room.capacity || 0);
  const occupied = Number(room.occupied || 0);

  return Math.max(
    0,
    Number(room.available_beds ?? capacity - occupied)
  );
}

function getOccupancyPercentage(occupied, capacity) {
  if (capacity <= 0) return 0;

  return Math.min(
    100,
    Math.round((occupied / capacity) * 100)
  );
}

function Occupancy() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newCapacity, setNewCapacity] = useState("");
  const [savingCapacity, setSavingCapacity] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRooms();
      setRooms(getList(data));
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load room occupancy. Please check your login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleEditCapacity = (room) => {
    setEditingRoomId(room.id);
    setNewCapacity(String(room.capacity ?? 1));
    setError("");
    setSuccess("");
  };

  const handleSaveCapacity = async (room) => {
    const capacity = Number(newCapacity);
    const occupied = Number(room.occupied || 0);

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Capacity must be a whole number greater than zero.");
      return;
    }

    if (capacity < occupied) {
      setError(
        `Capacity cannot be less than the ${occupied} occupied beds in this room.`
      );
      return;
    }

    setSavingCapacity(true);
    setError("");
    setSuccess("");

    try {
      await updateRoom(room.id, { capacity });

      setEditingRoomId(null);
      setNewCapacity("");
      setSuccess(`Capacity updated for Room ${room.room_number}.`);

      await loadRooms();
    } catch (err) {
      const data = err.response?.data;

      let message = "Could not update room capacity.";

      if (typeof data === "string") {
        message = data;
      } else if (data?.detail) {
        message = data.detail;
      } else if (data && typeof data === "object") {
        message = Object.entries(data)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages);

            return `${field}: ${text}`;
          })
          .join(" | ");
      }

      setError(message);
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setNewCapacity("");
    setError("");
    setSuccess("");
  };

  const totalCapacity = rooms.reduce(
    (total, room) => total + Number(room.capacity || 0),
    0
  );

  const totalOccupied = rooms.reduce(
    (total, room) => total + Number(room.occupied || 0),
    0
  );

  const totalAvailable = rooms.reduce(
    (total, room) => total + getAvailableBeds(room),
    0
  );

  const occupancyPercentage = getOccupancyPercentage(
    totalOccupied,
    totalCapacity
  );

  const stats = [
    {
      title: "Total Rooms",
      value: rooms.length,
      icon: "🚪",
      description: "Rooms across your hostels",
      color: "blue",
    },
    {
      title: "Total Beds",
      value: totalCapacity,
      icon: "🛏️",
      description: "Combined room capacity",
      color: "purple",
    },
    {
      title: "Occupied Beds",
      value: totalOccupied,
      icon: "👥",
      description: "Currently occupied",
      color: "orange",
    },
    {
      title: "Available Beds",
      value: totalAvailable,
      icon: "✓",
      description: "Beds available to fill",
      color: "green",
    },
  ];

  return (
    <div className="occupancy-page">
      <header className="occupancy-header">
        <div className="occupancy-header-content">
          <span className="occupancy-eyebrow">
            HOSTEL MANAGEMENT SYSTEM
          </span>

          <h1>Room Occupancy</h1>

          <p>
            Monitor room capacity, track occupied beds, and manage
            available space across your hostels.
          </p>
        </div>

        <button
          type="button"
          className="occupancy-refresh"
          onClick={loadRooms}
          disabled={loading || savingCapacity}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </header>

      {error && (
        <div className="occupancy-alert" role="alert">
          <span className="occupancy-alert-icon" aria-hidden="true">
            !
          </span>
          <span>{error}</span>
          <button
            type="button"
            className="occupancy-alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="occupancy-success" role="status">
          <span aria-hidden="true">✓</span>
          <span>{success}</span>
          <button
            type="button"
            className="occupancy-success-close"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="occupancy-loading">
          <span className="occupancy-spinner" />
          <p>Loading room occupancy information...</p>
        </div>
      ) : (
        <>
          <section
            className="occupancy-summary"
            aria-label="Occupancy statistics"
          >
            {stats.map((stat) => (
              <article
                className={`occupancy-stat stat-${stat.color}`}
                key={stat.title}
              >
                <div className="occupancy-stat-top">
                  <span>{stat.title}</span>
                  <span className="occupancy-stat-icon" aria-hidden="true">
                    {stat.icon}
                  </span>
                </div>

                <strong className="occupancy-stat-value">
                  {stat.value}
                </strong>

                <p>{stat.description}</p>
              </article>
            ))}
          </section>

          <section className="occupancy-card">
            <div className="occupancy-section-heading">
              <div>
                <span className="occupancy-section-label">
                  CAPACITY SUMMARY
                </span>
                <h2>Overall Occupancy</h2>
                <p>Current bed usage across all rooms</p>
              </div>

              <div className="occupancy-percentage">
                <strong>{occupancyPercentage}%</strong>
                <span>Occupied</span>
              </div>
            </div>

            <div
              className="occupancy-progress-track"
              role="progressbar"
              aria-label="Overall room occupancy"
              aria-valuenow={occupancyPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="occupancy-progress-fill"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>

            <div className="occupancy-overall-details">
              <div>
                <span className="occupancy-legend-dot dot-occupied" />
                <span>Occupied beds</span>
                <strong>{totalOccupied}</strong>
              </div>

              <div>
                <span className="occupancy-legend-dot dot-available" />
                <span>Available beds</span>
                <strong>{totalAvailable}</strong>
              </div>

              <div>
                <span className="occupancy-legend-dot dot-capacity" />
                <span>Total capacity</span>
                <strong>{totalCapacity}</strong>
              </div>
            </div>
          </section>

          <section className="occupancy-card occupancy-rooms-card">
            <div className="occupancy-section-heading">
              <div>
                <span className="occupancy-section-label">
                  ROOM MANAGEMENT
                </span>
                <h2>Room Details</h2>
                <p>
                  Review occupancy and edit the capacity of individual rooms.
                </p>
              </div>

              <span className="occupancy-room-count">
                {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
              </span>
            </div>

            {rooms.length === 0 ? (
              <div className="occupancy-empty">
                <span aria-hidden="true">🚪</span>
                <h3>No rooms available</h3>
                <p>
                  Add rooms in Manage Rooms to see their occupancy here.
                </p>
              </div>
            ) : (
              <div className="occupancy-table-wrapper">
                <table className="occupancy-table">
                  <thead>
                    <tr>
                      <th>Hostel</th>
                      <th>Room</th>
                      <th>Capacity</th>
                      <th>Occupied</th>
                      <th>Available</th>
                      <th>Occupancy</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rooms.map((room) => {
                      const capacity = Number(room.capacity || 0);
                      const occupied = Number(room.occupied || 0);
                      const available = getAvailableBeds(room);
                      const percentage = getOccupancyPercentage(
                        occupied,
                        capacity
                      );
                      const isEditing = editingRoomId === room.id;

                      return (
                        <tr key={room.id}>
                          <td>
                            <span className="occupancy-hostel-name">
                              {room.hostel_name ||
                                room.hostel?.name ||
                                (room.hostel
                                  ? `Hostel ${room.hostel.id ?? room.hostel}`
                                  : "Unassigned")}
                            </span>
                          </td>

                          <td>
                            <span className="occupancy-room-number">
                              {room.room_number ?? "—"}
                            </span>
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                className="occupancy-capacity-input"
                                type="number"
                                min={Math.max(1, occupied)}
                                step="1"
                                value={newCapacity}
                                onChange={(event) =>
                                  setNewCapacity(event.target.value)
                                }
                                aria-label={`New capacity for Room ${room.room_number}`}
                                disabled={savingCapacity}
                              />
                            ) : (
                              <strong className="occupancy-table-number">
                                {capacity}
                              </strong>
                            )}
                          </td>

                          <td>
                            <span className="occupancy-number-occupied">
                              {occupied}
                            </span>
                          </td>

                          <td>
                            <span className="occupancy-number-available">
                              {available}
                            </span>
                          </td>

                          <td>
                            <div className="room-occupancy">
                              <div
                                className="room-progress-track"
                                role="progressbar"
                                aria-label={`Room ${room.room_number} occupancy`}
                                aria-valuenow={percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className={`room-progress-fill ${
                                    percentage >= 100 ? "room-fill-full" : ""
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="room-occupancy-percentage">
                                {percentage}%
                              </span>
                            </div>
                          </td>

                          <td>
                            {isEditing ? (
                              <div className="capacity-actions">
                                <button
                                  type="button"
                                  className="capacity-save-button"
                                  disabled={savingCapacity}
                                  onClick={() => handleSaveCapacity(room)}
                                >
                                  {savingCapacity ? "Saving..." : "Save"}
                                </button>

                                <button
                                  type="button"
                                  className="capacity-cancel-button"
                                  disabled={savingCapacity}
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="capacity-edit-button"
                                onClick={() => handleEditCapacity(room)}
                                disabled={editingRoomId !== null}
                              >
                                Edit Capacity
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Occupancy;
