import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiArrowLeft, FiEyeOff } from "react-icons/fi";
import { FaLeaf, FaShieldAlt } from "react-icons/fa";
import { getErrorMessage } from "../../utils/errorHandler.js";

// dari const ke function karna
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      //   const message =
      //     error.response?.data?.message ||
      //     error.message ||
      //     "Login gagal. Silakan coba kembali.";
      //   setErrorMessage(message);
      setErrorMessage(
        getErrorMessage(
          error,
          "Login gagal. Periksa kembali email dan password.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-header">
          <FaShieldAlt className="brand-icon" />
          <span>RBAC System</span>
        </div>

        <div className="login-left-content">
          <span className="badge-text">
            <FaShieldAlt /> Role-Based Access Control System
          </span>
          <h1>Centralized access control, structured system security</h1>
          <p>
            Manage roles, permissions, and user access in a secure, transparent,
            and easily auditable way
          </p>
        </div>

        <div className="login-left-footer">
          <p>© 2026 RBAC System · Controlled access for every role</p>
        </div>
      </div>

      <div className="login-right">
        <div className="form-wrapper">
          {/* <div className="back-link" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </div> */}

          <div className="form-header">
            <span className="subtitle">WELCOME BACK</span>
            <h2>Sign in your space</h2>
            <p>One small step to manage system permissions again</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label-row" htmlFor="email">
                Email
              </label>
              <div className="input-field">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@exmple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link className="forgot-link" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="input-field">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Input your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? (
                  <FiEyeOff
                    className="input-icon-right"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FiEye
                    className="input-icon-right"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                onChange={handleChange}
              />
              <label htmlFor="remember">Remember me on this device</label>
            </div>

            {errorMessage && <div className="login-error">{errorMessage}</div>}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>

            <div className="form-footer">
              <p>
                Don't have an account?
                {/* <a href="#register">Sign up now</a> */}{" "}
                <Link to="/register">Sign up now</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
