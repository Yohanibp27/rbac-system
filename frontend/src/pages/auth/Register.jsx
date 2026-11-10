import React, { useState } from "react";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  //   const [register] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassowrd: "",
    agreements: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "Belum diisi", level: 0 };
    if (pass.length < 6) return { label: "Lemah", level: 1 };
    if (pass.length < 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: "Sedang", level: 2 };
    }
    if (
      pass.length >= 8 && // panjang harus lebih dari = 8
      /[A-Z]/.test(pass) && // mengandung huruf besar A-Z
      /[0-9]/.test(pass) && // mengandung angka 0-9
      /[^A-Za-z0-9]/.test(pass) // mengandung simbol khusus
    ) {
      return { label: "Kuat", level: 3 };
    }
    return { label: "Sedang", level: 2 };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      //   await register(formData);
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Register gagal. Silakan coba kembali.";

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
            <FaArrowLeft /> Back
          </div> */}

          <div className="form-header">
            <span className="subtitle">Start from here</span>
            <h2>Create a new account</h2>
            <p>
              Maintain a digital space that feels secure, organized, and truly
              yours
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label-row">Username</label>
              <div className="input-field">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="text"
                  id="text"
                  placeholder="Example: Nara Putri"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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

            <div className="input-group">
              <label className="label-row">Password</label>
              <div className="input-field">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Min. 8 characters"
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

              <div className="password-strength-container">
                <div className="strength-bar-background">
                  <div
                    className={`strength-bar-fill level-${passwordStrength.level}`}
                  />
                </div>
                <span className="strength-label">{passwordStrength.label}</span>
              </div>
            </div>

            <div className="input-group">
              <label className="label-row">Confirm Password</label>
              <div className="input-field-password">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassowrd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                onChange={handleChange}
              />
              <label htmlFor="agreement">
                I agree to the RBAC System terms of use
              </label>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="submit-button" disabled>
              {isSubmitting ? "Loading..." : "Sign up"}
            </button>

            <div className="form-footer">
              <p>
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
