
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../api/authApi";

import "../styles/Profile.css";

function getErrorMessage(err, fallback) {
  const data = err.response?.data;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([field, value]) => {
        const detail = Array.isArray(value)
          ? value.join(" ")
          : typeof value === "string"
            ? value
            : JSON.stringify(value);

        return `${field.replaceAll("_", " ")}: ${detail}`;
      })
      .join(" ");
  }

  return fallback;
}

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (!active) return;

        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Profile loading error:", err);

        if (!active) return;

        setError(
          err.response?.status === 401
            ? "Your session has expired. Please log in again."
            : "Unable to load your profile."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
    });

    setError("");
    setMessage("");
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
    });

    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username) {
      setError("Username is required.");
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile({ username, email });

      setProfile((previous) => ({
        ...previous,
        ...data,
        username: data.username ?? username,
        email: data.email ?? email,
      }));

      setFormData({
        username: data.username ?? username,
        email: data.email ?? email,
      });

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        getErrorMessage(
          err,
          "Unable to update your profile. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (
      passwordData.new_password !== passwordData.confirm_password
    ) {
      setPasswordError("The new passwords do not match.");
      return;
    }

    if (
      passwordData.new_password === passwordData.current_password
    ) {
      setPasswordError(
        "Your new password must be different from your current password."
      );
      return;
    }

    setPasswordSaving(true);

    try {
      const data = await changePassword(passwordData);

      setPasswordMessage(
        data?.message || "Password changed successfully."
      );

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowPasswordForm(false);
    } catch (err) {
      console.error("Change password error:", err);

      setPasswordError(
        getErrorMessage(
          err,
          "Unable to change your password. Please try again."
        )
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordError("");
    setPasswordMessage("");

    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading-card">
          <span className="profile-spinner" />
          <p>Loading your account information...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div>
            <span className="profile-eyebrow">ACCOUNT MANAGEMENT</span>
            <h1>My Profile</h1>
            <p>View and manage your hostel owner account.</p>
          </div>
        </div>

        <div className="profile-card profile-unavailable">
          <span className="profile-empty-icon">👤</span>
          <h2>Profile unavailable</h2>
          <p className="profile-error" role="alert">
            {error || "Your profile could not be loaded."}
          </p>

          <button
            type="button"
            className="profile-button"
            onClick={() => navigate("/login", { replace: true })}
          >
            Go to Login <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );
  }

  const initial = profile.username?.trim()?.charAt(0).toUpperCase() || "O";

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-header-content">
          <span className="profile-eyebrow">
            ACCOUNT MANAGEMENT
          </span>
          <h1>My Profile</h1>
          <p>
            Manage your account information and security settings
            in one place.
          </p>
        </div>

        <div className="profile-header-decoration" aria-hidden="true">
          👤
        </div>
      </header>

      <div className="profile-layout">
        <section className="profile-card profile-main-card">
          <div className="profile-identity">
            <div className="profile-avatar" aria-label="Profile initial">
              {initial}
            </div>

            <div className="profile-identity-info">
              <span className="profile-role-badge">
                <span className="profile-online-dot" />
                Hostel Owner
              </span>

              <h2>{profile.username || "Hostel Owner"}</h2>
              <p>{profile.email || "No email address added"}</p>
            </div>
          </div>

          {message && (
            <div className="profile-alert profile-alert-success" role="status">
              <span aria-hidden="true">✓</span>
              {message}
            </div>
          )}

          {error && (
            <div className="profile-alert profile-alert-error" role="alert">
              <span aria-hidden="true">!</span>
              {error}
            </div>
          )}

          <div className="profile-section-heading">
            <div>
              <span className="profile-section-label">PERSONAL DETAILS</span>
              <h3>Account Information</h3>
              <p>Review or update your account details.</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="profile-button profile-edit-button"
                onClick={handleEdit}
              >
                <span aria-hidden="true">✎</span> Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="profile-detail">
                <span className="profile-detail-icon" aria-hidden="true">
                  # 
                </span>
                <div>
                  <span className="profile-detail-label">Owner ID</span>
                  <strong>{profile.id ?? "Not available"}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <span className="profile-detail-icon" aria-hidden="true">
                  👤
                </span>
                <div>
                  <span className="profile-detail-label">Username</span>
                  <strong>{profile.username || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <span className="profile-detail-icon" aria-hidden="true">
                  ✉
                </span>
                <div>
                  <span className="profile-detail-label">Email Address</span>
                  <strong>{profile.email || "No email available"}</strong>
                </div>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-heading">
                <h3>Edit Account Details</h3>
                <p>Update the information associated with your account.</p>
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-username">Username</label>
                <input
                  id="profile-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  maxLength={150}
                  required
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="profile-actions">
                <button
                  className="profile-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className="profile-cancel-button"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="profile-card profile-security-card">
          <div className="profile-security-heading">
            <span className="profile-security-icon" aria-hidden="true">
              🔒
            </span>

            <div>
              <span className="profile-section-label">ACCOUNT PROTECTION</span>
              <h2>Security Settings</h2>
              <p>Keep your account secure by updating your password.</p>
            </div>
          </div>

          {passwordMessage && (
            <div
              className="profile-alert profile-alert-success"
              role="status"
            >
              <span aria-hidden="true">✓</span>
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div
              className="profile-alert profile-alert-error"
              role="alert"
            >
              <span aria-hidden="true">!</span>
              {passwordError}
            </div>
          )}

          {!showPasswordForm ? (
            <div className="profile-security-summary">
              <div>
                <strong>Password</strong>
                <p>Change your password to help protect your account.</p>
              </div>

              <button
                type="button"
                className="profile-button"
                onClick={() => {
                  setPasswordError("");
                  setPasswordMessage("");
                  setShowPasswordForm(true);
                }}
              >
                Change Password
              </button>
            </div>
          ) : (
            <form
              className="profile-form profile-password-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="profile-form-field">
                <label htmlFor="current-password">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="profile-actions">
                <button
                  type="submit"
                  className="profile-button"
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={cancelPasswordChange}
                  disabled={passwordSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <div className="profile-footer">
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>

        <span className="profile-footer-note">
          Hostel Management System
        </span>
      </div>
    </div>
  );
}

export default Profile;
