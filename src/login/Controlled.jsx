import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

export default function Controlled() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "chef@recipes.com",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //: טיפול בשליחת הטופס
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // וולידציה לאימייל
    if (!formData.email) {
      newErrors.email = "שדה חובה";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    // וולידציה לסיסמה
    if (!formData.password) {
      newErrors.password = "שדה חובה";
    } 
    else if (formData.password.length < 6) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    }

    setErrors(newErrors);
    setGeneralError("");

    // אם אין שגיאות וולידציה
    if (Object.keys(newErrors).length === 0) {
      const user = login({ email: formData.email, password: formData.password });
      
      if (!user) {
        setGeneralError("אימייל או סיסמא שגויים");
      } 
      else {
        navigate("/recipes");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px" }}>
      <h2>התחברות (טופס מבוקר)</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>אימייל:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
          {errors.email && <span style={{ color: "red", fontSize: "14px" }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>סיסמא:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
          {errors.password && <span style={{ color: "red", fontSize: "14px" }}>{errors.password}</span>}
        </div>

        {generalError && (
          <div style={{ color: "red", marginBottom: "15px", fontWeight: "bold" }}>
            {generalError}
          </div>
        )}

        <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
          התחבר
        </button>
      </form>
    </div>
  );
}