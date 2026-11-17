import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate } from "react-router";
import { login } from "../services/auth";
import { useState } from "react";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'אימייל הוא שדה חובה',
      'string.email': 'כתובת האימייל אינה תקינה',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'סיסמה היא שדה חובה',
      'string.min': 'הסיסמה חייבת להכיל לפחות 6 תווים',
    }),
});

export default function Rhf() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      email: "chef@recipes.com",
      password: "",
    },
  }); 
  const onSubmit = (data) => {
    setGeneralError("");
    const user = login({ email: data.email, password: data.password });

    if (!user) {
      setGeneralError("אימייל או סיסמא שגויים");
    } 
    else {
      navigate("/recipes");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px" }}>
      <h2>התחברות (React Hook Form)</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>אימייל:</label>
          <input
            type="email"
            {...register("email")}
            style={{ width: "100%", padding: "8px" }}
          />
          {touchedFields.email && errors.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>סיסמא:</label>
          <input
            type="password"
            {...register("password")}
            style={{ width: "100%", padding: "8px" }}
          />
          {touchedFields.password && errors.password && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        {generalError && (
          <div style={{ color: "red", marginBottom: "15px", fontWeight: "bold" }}>
            {generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          {isSubmitting ? "מתחבר..." : "התחבר"}
        </button>
      </form>
    </div>
  );

}