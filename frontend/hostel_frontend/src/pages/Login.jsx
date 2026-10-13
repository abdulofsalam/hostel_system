
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { saveTokens, saveUser } from "../utils/auth";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Keep the existing JWT authentication flow.
      saveTokens(data);
      saveUser({ username: formData.username });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      const responseData = err.response?.data;

      setError(
        responseData?.detail ||
          responseData?.non_field_errors?.[0] ||
          "Invalid username or password. Please try again."
      );
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
              ✦ YOUR WORKSPACE, SIMPLIFIED
            </span>

            <h2>
              Manage Your
              <br />
              Hostel with
              <br />
              <span>Ease.</span>
            </h2>

            <p>
              Welcome back. Keep your rooms, students, occupancy and
              payments organized in one place.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">⌂</span>
                <span>Manage your hostels</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">▤</span>
                <span>Monitor rooms and occupancy</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">↗</span>
                <span>Keep track of payments</span>
              </div>
            </div>
          </div>

          <div className="auth-visual-footer">
            Welcome back · Your hostel, under control
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

            <h2 className="auth-heading">Welcome back!</h2>
            <p className="auth-description">
              Sign in to access your hostel management dashboard.
            </p>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="login-username">
                  Username
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">♙</span>
                  <input
                    className="auth-input"
                    id="login-username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">♙</span>
                  <input
                    className="auth-input"
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
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

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to dashboard"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?
              <button type="button" onClick={() => navigate("/signup")}>
                Create account
              </button>
            </p>

            <p className="auth-security-note">
              Secure access to your hostel management workspace.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
