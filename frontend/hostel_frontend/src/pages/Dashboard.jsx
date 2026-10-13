
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getHostels } from "../api/hosteApi";
import { getRooms } from "../api/rooApi";
import { getStudents } from "../api/studentApi";

import "../styles/Dashboard.css";

function getList(data) {
  if (Array.isArray(data)) return data;
  return data?.results || [];
}

function getRoomHostelId(room) {
  return (
    room.hostel?.id ??
    room.hostel ??
    room.hostel_id ??
    room.hostelId
  );
}

function getRoomOccupancy(rooms) {
  return rooms.reduce(
    (totals, room) => {
      const capacity = Number(room.capacity || 0);
      const occupied = Number(room.occupied || 0);
      const available = Number(
        room.available_beds ?? Math.max(0, capacity - occupied)
      );

      totals.capacity += capacity;
      totals.occupied += occupied;
      totals.available += available;

      return totals;
    },
    { capacity: 0, occupied: 0, available: 0 }
  );
}

function getHostelStatus(capacity, occupied) {
  if (capacity <= 0) return "Unknown";
  if (occupied >= capacity) return "Full";
  if (occupied <= 0) return "Available";
  return "Partially occupied";
}

function Dashboard() {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [hostelData, roomData, studentData] = await Promise.all([
        getHostels(),
        getRooms(),
        getStudents(),
      ]);

      setHostels(getList(hostelData));
      setRooms(getList(roomData));
      setStudents(getList(studentData));
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load dashboard data. Please check your login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const overall = getRoomOccupancy(rooms);

  const occupancyRate =
    overall.capacity > 0
      ? Math.min(
          100,
          Math.round((overall.occupied / overall.capacity) * 100)
        )
      : 0;

  const hostelOccupancy = hostels.map((hostel) => {
    const hostelRooms = rooms.filter(
      (room) =>
        String(getRoomHostelId(room)) === String(hostel.id)
    );

    const totals = getRoomOccupancy(hostelRooms);

    const percentage =
      totals.capacity > 0
        ? Math.min(
            100,
            Math.round((totals.occupied / totals.capacity) * 100)
          )
        : 0;

    return {
      id: hostel.id,
      name: hostel.name || hostel.hostel_name || "Unnamed Hostel",
      roomCount: hostelRooms.length,
      capacity: totals.capacity,
      occupied: totals.occupied,
      available: totals.available,
      percentage,
      status: getHostelStatus(totals.capacity, totals.occupied),
    };
  });

  const stats = [
    {
      title: "Total Hostels",
      value: hostels.length,
      icon: "🏨",
      description: "Hostels you manage",
      link: "/hostels",
      color: "blue",
    },
    {
      title: "Total Rooms",
      value: rooms.length,
      icon: "🚪",
      description: "Rooms across your hostels",
      link: "/rooms",
      color: "purple",
    },
    {
      title: "Total Students",
      value: students.length,
      icon: "👨‍🎓",
      description: "Registered students",
      link: "/students",
      color: "green",
    },
    {
      title: "Occupied Beds",
      value: overall.occupied,
      icon: "🛏️",
      description: `${overall.available} beds available`,
      link: "/occupancy",
      color: "orange",
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <span className="dashboard-eyebrow">
            HOSTEL MANAGEMENT SYSTEM
          </span>

          <h1>Dashboard Overview</h1>

          <p>
            Welcome back! Here is an overview of your hostels,
            rooms, students, and bed occupancy.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={loadDashboard}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </header>

      {error && (
        <div className="dashboard-error" role="alert">
          <span aria-hidden="true">!</span>
          {error}
          <button
            type="button"
            className="dashboard-error-retry"
            onClick={loadDashboard}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="dashboard-loading">
          <span className="dashboard-spinner" />
          <p>Loading your dashboard information...</p>
        </div>
      ) : (
        <>
          <section className="dashboard-stats" aria-label="Management summary">
            {stats.map((stat) => (
              <Link
                to={stat.link}
                className={`dashboard-stat-card stat-${stat.color}`}
                key={stat.title}
              >
                <div className="dashboard-stat-top">
                  <span className="dashboard-stat-title">
                    {stat.title}
                  </span>

                  <span className="dashboard-stat-icon" aria-hidden="true">
                    {stat.icon}
                  </span>
                </div>

                <strong className="dashboard-stat-value">
                  {stat.value}
                </strong>

                <p>{stat.description}</p>

                <span className="dashboard-stat-link">
                  View details <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="dashboard-section-label">
                  OCCUPANCY SUMMARY
                </span>
                <h2>Overall Room Occupancy</h2>
                <p>Current bed usage across all your rooms</p>
              </div>

              <div className="dashboard-overall-rate">
                <strong>{occupancyRate}%</strong>
                <span>Occupied</span>
              </div>
            </div>

            <div
              className="dashboard-progress-track"
              role="progressbar"
              aria-label="Overall room occupancy"
              aria-valuenow={occupancyRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="dashboard-progress-fill"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>

            <div className="dashboard-occupancy-details">
              <div className="occupancy-detail">
                <span className="occupancy-dot occupied-dot" />
                <span>Occupied beds</span>
                <strong>{overall.occupied}</strong>
              </div>

              <div className="occupancy-detail">
                <span className="occupancy-dot available-dot" />
                <span>Available beds</span>
                <strong>{overall.available}</strong>
              </div>

              <div className="occupancy-detail">
                <span className="occupancy-dot capacity-dot" />
                <span>Total capacity</span>
                <strong>{overall.capacity}</strong>
              </div>
            </div>

            <Link to="/occupancy" className="dashboard-text-link">
              View room occupancy <span aria-hidden="true">→</span>
            </Link>
          </section>

          <section className="dashboard-panel hostel-occupancy-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="dashboard-section-label">
                  HOSTEL PERFORMANCE
                </span>
                <h2>Room Occupancy by Hostel</h2>
                <p>Compare bed usage and availability for each hostel</p>
              </div>

              <Link to="/hostels" className="dashboard-text-link">
                Manage Hostels <span aria-hidden="true">→</span>
              </Link>
            </div>

            {hostelOccupancy.length === 0 ? (
              <div className="hostel-occupancy-empty">
                <span className="empty-state-icon" aria-hidden="true">
                  🏨
                </span>
                <h3>No hostels available</h3>
                <p>
                  Add your first hostel to see its occupancy information here.
                </p>
                <Link to="/hostels" className="dashboard-primary-link">
                  Add a Hostel <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <div className="hostel-occupancy-list">
                {hostelOccupancy.map((hostel) => (
                  <article
                    className="hostel-occupancy-card"
                    key={hostel.id}
                  >
                    <div className="hostel-occupancy-top">
                      <div className="hostel-occupancy-info">
                        <span
                          className="hostel-mini-icon"
                          aria-hidden="true"
                        >
                          🏢
                        </span>

                        <div>
                          <h3>{hostel.name}</h3>
                          <p>
                            {hostel.roomCount} rooms · {hostel.capacity} total beds
                          </p>
                        </div>
                      </div>

                      <span
                        className={`hostel-occupancy-status ${
                          hostel.status === "Full"
                            ? "status-full"
                            : hostel.status === "Available"
                              ? "status-available"
                              : hostel.status === "Partially occupied"
                                ? "status-partial"
                                : "status-unknown"
                        }`}
                      >
                        {hostel.status}
                      </span>
                    </div>

                    <div className="hostel-occupancy-metrics">
                      <div>
                        <span>Occupied</span>
                        <strong>{hostel.occupied}</strong>
                      </div>
                      <div>
                        <span>Available</span>
                        <strong>{hostel.available}</strong>
                      </div>
                      <div>
                        <span>Occupancy</span>
                        <strong>{hostel.percentage}%</strong>
                      </div>
                    </div>

                    <div
                      className="hostel-occupancy-track"
                      role="progressbar"
                      aria-label={`${hostel.name} bed occupancy`}
                      aria-valuenow={hostel.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`hostel-occupancy-fill ${
                          hostel.status === "Full" ? "fill-full" : ""
                        }`}
                        style={{ width: `${hostel.percentage}%` }}
                      />
                    </div>

                    <div className="hostel-occupancy-bottom">
                      <span>{hostel.percentage}% of capacity used</span>
                      <span>{hostel.available} beds available</span>
                    </div>

                    <Link to="/rooms" className="dashboard-text-link">
                      View Rooms <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="dashboard-section-label">SHORTCUTS</span>
                <h2>Quick Actions</h2>
                <p>Go directly to a management module</p>
              </div>
            </div>

            <div className="dashboard-quick-actions">
              <Link to="/hostels">
                <span aria-hidden="true">🏨</span>
                <span>Manage Hostels</span>
                <span className="quick-action-arrow" aria-hidden="true">→</span>
              </Link>

              <Link to="/rooms">
                <span aria-hidden="true">🚪</span>
                <span>Manage Rooms</span>
                <span className="quick-action-arrow" aria-hidden="true">→</span>
              </Link>

              <Link to="/students">
                <span aria-hidden="true">👨‍🎓</span>
                <span>Manage Students</span>
                <span className="quick-action-arrow" aria-hidden="true">→</span>
              </Link>

              <Link to="/occupancy">
                <span aria-hidden="true">🛏️</span>
                <span>View Occupancy</span>
                <span className="quick-action-arrow" aria-hidden="true">→</span>
              </Link>

              <Link to="/payments">
                <span aria-hidden="true">💳</span>
                <span>Payments</span>
                <span className="quick-action-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          <div className="dashboard-recent-grid">
            <section className="dashboard-panel dashboard-recent-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-section-label">
                    YOUR PROPERTIES
                  </span>
                  <h2>Recent Hostels</h2>
                  <p>Your latest hostel records</p>
                </div>

                <Link to="/hostels" className="dashboard-text-link">
                  View all <span aria-hidden="true">→</span>
                </Link>
              </div>

              {hostels.length === 0 ? (
                <div className="dashboard-empty-message">
                  No hostels added yet.
                </div>
              ) : (
                <div className="dashboard-recent-list">
                  {hostels.slice(-5).reverse().map((hostel) => (
                    <div className="dashboard-recent-item" key={hostel.id}>
                      <span className="recent-item-icon" aria-hidden="true">
                        🏨
                      </span>
                      <div>
                        <strong>
                          {hostel.name ||
                            hostel.hostel_name ||
                            "Unnamed Hostel"}
                        </strong>
                        <p>{hostel.address || "No address provided"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-panel dashboard-recent-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-section-label">
                    STUDENT RECORDS
                  </span>
                  <h2>Recent Students</h2>
                  <p>Your latest student records</p>
                </div>

                <Link to="/students" className="dashboard-text-link">
                  View all <span aria-hidden="true">→</span>
                </Link>
              </div>

              {students.length === 0 ? (
                <div className="dashboard-empty-message">
                  No students registered yet.
                </div>
              ) : (
                <div className="dashboard-recent-list">
                  {students.slice(-5).reverse().map((student) => (
                    <div className="dashboard-recent-item" key={student.id}>
                      <span className="recent-item-icon student-recent-icon">
                        👤
                      </span>
                      <div>
                        <strong>
                          {student.name ||
                            student.full_name ||
                            student.username ||
                            "Unnamed Student"}
                        </strong>
                        <p>{student.email || "No email provided"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
