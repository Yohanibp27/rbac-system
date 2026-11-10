import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiArrowLeft, FiEyeOff } from "react-icons/fi";
import {
  FaAlignRight,
  FaArrowRight,
  FaLeaf,
  FaShieldAlt,
} from "react-icons/fa";

function ForgotPassword() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login gagal. Silakan coba kembali.";

      setError(message);
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
          <h1>Centralized access control, structured system securit</h1>
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
        <div className="from-wrapper">
          <div className="back-link" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </div>

          <div className="form-header">
            <span className="subtitle">ACCOUNT RECOVERY</span>
            <h2>Forgot password?</h2>
            <p>Enter your email. We will help you with the next steps</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label-row">Email</label>
              <div className="input-field">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {error && <div className="login-error">{error}</div>}
            <button
              type="button"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Loading..."
              ) : (
                <>
                  Send reset link <FaArrowRight />
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                Not receiving emails? Make sure the address you entered is
                correct
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
