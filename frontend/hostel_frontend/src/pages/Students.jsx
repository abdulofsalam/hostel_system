import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";
import { getRooms } from "../api/rooApi";
import "../styles/Students.css";

const emptyForm = {
  room: "",
  full_name: "",
  cnic: "",
  phone: "",
  email: "",
  guardian_name: "",
  guardian_phone: "",
  address: "",
  admission_date: "",
  monthly_rent: "",
  is_active: true,
};

function Students() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load students and rooms from Django API
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentData, roomData] = await Promise.all([
        getStudents(),
        getRooms(),
      ]);

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : studentData.results || []
      );

      setRooms(
        Array.isArray(roomData)
          ? roomData
          : roomData.results || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load students or rooms. Please check your login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();
  
    const matchesSearch =
      (student.full_name || "").toLowerCase().includes(search) ||
      (student.cnic || "").toLowerCase().includes(search) ||
      (student.phone || "").toLowerCase().includes(search);
  
    const matchesRoom =
      roomFilter === "" ||
      String(student.room) === roomFilter;
  
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.is_active) ||
      (statusFilter === "inactive" && !student.is_active);
  
    return matchesSearch && matchesRoom && matchesStatus;
  });

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Register a new student or update an existing student
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const studentData = {
        ...form,
        room: Number(form.room),
        monthly_rent: Number(form.monthly_rent),
      };

      if (editingId !== null) {
        await updateStudent(editingId, studentData);
        setSuccess("Student updated successfully.");
      } else {
        await createStudent(studentData);
        setSuccess("Student registered successfully.");
      }

      // Reset form after a successful save
      setEditingId(null);
      setForm({ ...emptyForm });

      // Refresh the student table
      await loadData();
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data === "string"
          ? data
          : data
            ? Object.entries(data)
                .map(([field, messages]) => {
                  const message = Array.isArray(messages)
                    ? messages.join(", ")
                    : typeof messages === "object" && messages !== null
                      ? JSON.stringify(messages)
                      : messages;

                  return `${field}: ${message}`;
                })
                .join(" | ")
            : "Could not save student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Load the selected student's information into the form
  const handleEdit = (student) => {
    setEditingId(student.id);

    setForm({
      room: String(student.room ?? ""),
      full_name: student.full_name ?? "",
      cnic: student.cnic ?? "",
      phone: student.phone ?? "",
      email: student.email ?? "",
      guardian_name: student.guardian_name ?? "",
      guardian_phone: student.guardian_phone ?? "",
      address: student.address ?? "",
      admission_date: student.admission_date ?? "",
      monthly_rent: String(student.monthly_rent ?? ""),
      is_active: student.is_active ?? true,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing or clear the form
  const handleClear = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Delete a student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteStudent(id);
      setSuccess("Student deleted successfully.");

      if (editingId === id) {
        handleClear();
      }

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not delete this student."
      );
    }
  };

  return (
    <div className="students-page">
      <div className="students-header">
        <div>
          <h1>Student Management</h1>
          <p>
            Register students and manage their room assignments.
          </p>
        </div>

        <div className="student-count">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      {error && (
        <div className="student-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="student-alert success">
          {success}
        </div>
      )}

      <section className="student-card">
        <h2>
          {editingId !== null
            ? "Edit Student"
            : "Register New Student"}
        </h2>

        <form onSubmit={handleSubmit} className="student-form">
          <label>
            Full Name *
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Assign Room *
            <select
              name="room"
              value={form.room}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.hostel_name || `Hostel ${room.hostel}`}
                  {" — "}Room {room.room_number}
                  {" (Capacity: "}{room.capacity}{")"}
                </option>
              ))}
            </select>
          </label>

          <label>
            CNIC *
            <input
              name="cnic"
              value={form.cnic}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone *
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Guardian Name *
            <input
              name="guardian_name"
              value={form.guardian_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Guardian Phone *
            <input
              name="guardian_phone"
              value={form.guardian_phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Admission Date *
            <input
              type="date"
              name="admission_date"
              value={form.admission_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Monthly Rent *
            <input
              type="number"
              name="monthly_rent"
              min="0"
              step="0.01"
              value={form.monthly_rent}
              onChange={handleChange}
              required
            />
          </label>

          <label className="full-width">
            Home Address *
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </label>

          <label className="active-checkbox">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active Student
          </label>

          <div className="form-actions full-width">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Student"
                  : "Register Student"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleClear}
            >
              Cancel / Clear
            </button>
          </div>
        </form>
      </section>

      
      <section className="student-card">
         <h2>Registered Students</h2>

       <div className="student-filters">
       <input
       type="text"
       placeholder="Search name, CNIC, or phone..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
       value={roomFilter}
       onChange={(e) => setRoomFilter(e.target.value)}
     >
      <option value="">All Rooms</option>

      {rooms.map((room) => (
        <option key={room.id} value={String(room.id)}>
          {room.hostel_name || `Hostel ${room.hostel}`} — Room{" "}
          {room.room_number}
        </option>
      ))}
    </select>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="all">All Students</option>
      <option value="active">Active Students</option>
      <option value="inactive">Inactive Students</option>
    </select>

    <button
      type="button"
      className="secondary-button"
      onClick={() => {
        setSearchTerm("");
        setRoomFilter("");
        setStatusFilter("all");
      }}
    >
      Reset Filters
    </button>
  </div>

  <p>
    Showing {filteredStudents.length} of {students.length} students
  </p>


        {loading ? (
          <p>Loading students...</p>
        ) : filteredStudents.length === 0 ? (
            <p>
              {students.length === 0
                ? "No students registered yet."
                : "No students match your search or filters."}
            </p>
        ) : (
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>CNIC</th>
                  <th>Phone</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
              {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.full_name}</td>
                    <td>{student.cnic}</td>
                    <td>{student.phone}</td>
                    <td>{student.hostel_name}</td>
                    <td>{student.room_number}</td>
                    <td>{student.monthly_rent}</td>

                    <td>
                      <span
                        className={
                          student.is_active
                            ? "student-status active"
                            : "student-status inactive"
                        }
                      >
                        {student.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Students;