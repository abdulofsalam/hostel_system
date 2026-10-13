
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.password2) {
      setError("Your passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password2: formData.password2,
      });

      setSuccess("Your account has been created. Redirecting to login...");

      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Django response:", err.response?.data);

      const data = err.response?.data;

      if (data && typeof data === "object") {
        setError(
          Object.entries(data)
            .map(([field, messages]) => {
              const readableField = field
                .replaceAll("_", " ")
                .replace(/^./, (char) => char.toUpperCase());

              const readableMessage = Array.isArray(messages)
                ? messages.join(", ")
                : String(messages);

              return `${readableField}: ${readableMessage}`;
            })
            .join(" | ")
        );
      } else {
        setError("Cannot connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-brand">
            <div className="auth-brand-mark">⌂</div>
            <div>
              <h1 className="auth-brand-name">
                Hostel<span>Hub</span>
              </h1>
              <p className="auth-brand-subtitle">
                Smart Hostel Management
              </p>
            </div>
          </div>

          <div className="auth-promo">
            <span className="auth-eyebrow">
              ✦ BUILT FOR HOSTEL OWNERS
            </span>

            <h2>
              Your Hostel
              <br />
              Management
              <br />
              <span>Partner.</span>
            </h2>

            <p>
              Bring your hostel operations together. Manage rooms,
              students, occupancy and payments from one simple dashboard.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">⌂</span>
                <span>Organize your hostels</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">▤</span>
                <span>Track rooms and occupancy</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">↗</span>
                <span>Manage student payments</span>
              </div>
            </div>
          </div>

          <div className="auth-visual-footer">
            Simple &amp; secure · Designed for hostel management
          </div>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-mobile-brand">
              <div className="auth-brand-mark">⌂</div>
              <div>
                <h2 className="auth-brand-name">
                  Hostel<span>Hub</span>
                </h2>
                <p className="auth-brand-subtitle">
                  Smart Hostel Management
                </p>
              </div>
            </div>

            <h2 className="auth-heading">Create your account</h2>
            <p className="auth-description">
              Get started with a smarter way to manage your hostel.
            </p>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert-success" role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="signup-username">
                  Username
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">♙</span>
                  <input
                    className="auth-input"
                    id="signup-username"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={150}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="signup-email">
                  Email address
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉</span>
                  <input
                    className="auth-input"
                    id="signup-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">♙</span>
                  <input
                    className="auth-input"
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="signup-password2">
                  Confirm password
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">♙</span>
                  <input
                    className="auth-input"
                    id="signup-password2"
                    type={showConfirmPassword ? "text" : "password"}
                    name="password2"
                    placeholder="Enter your password again"
                    value={formData.password2}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?
              <button type="button" onClick={() => navigate("/login")}>
                Sign in
              </button>
            </p>

            <p className="auth-security-note">
              Your hostel management workspace starts here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;
