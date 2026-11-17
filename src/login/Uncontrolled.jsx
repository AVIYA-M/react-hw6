import { useActionState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

/*
  תשובה לשאלה של הצגת שגיאות:
  האם ניתן לבדוק תקינות בעת הקלדה? 
  - התשובה היא לא, בטופס לא מבוקר אין state שמתעדכן בזמן הקלדה, ולכן לא ניתן לבדוק תקינות תוך כדי הקלדה.
  - הבדיקה מתבצעת בשליחת הטופס בלבד על ידי הפונקציה ב-action
*/

export default function Uncontrolled() {
  const navigate = useNavigate();

  const handleFormAction = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const newErrors = {};

    //: טיפול בשליחת הטופס
    if (!email) {
      newErrors.email = "שדה חובה";
    } 
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (!password) {
      newErrors.password = "שדה חובה";
    } 
    else if (password.length < 6) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    }

    if (Object.keys(newErrors).length > 0) {
      return { errors: newErrors, values: { email, password }, generalError: "" };
    }

    const user = login({ email, password });

    if (!user) {
      return {
        errors: {},
        values: { email, password },
        generalError: "אימייל או סיסמא שגויים",
      };
    }

    navigate("/recipes");
    return { errors: {}, values: { email, password }, generalError: "" };
  };

  const [state, formAction, isPending] = useActionState(handleFormAction, {
    errors: {},
    values: { email: "chef@recipes.com", password: "" },
    generalError: "",
  });

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px" }}>
      <h2>התחברות (טופס לא מבוקר)</h2>

      <form action={formAction} noValidate>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>אימייל:</label>
          <input
            type="email"
            name="email"
            defaultValue={state.values?.email}
            style={{ width: "100%", padding: "8px" }}
          />
          {state.errors?.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {state.errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>סיסמא:</label>
          <input
            type="password"
            name="password"
            defaultValue={state.values?.password}
            style={{ width: "100%", padding: "8px" }}
          />
          {state.errors?.password && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {state.errors.password}
            </span>
          )}
        </div>

        {state.generalError && (
          <div style={{ color: "red", marginBottom: "15px", fontWeight: "bold" }}>
            {state.generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          {isPending ? "מתחבר..." : "התחבר"}
        </button>
      </form>
    </div>
  );
}