import { useFormik } from "formik";
import * as Yup from "yup";
import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../Api";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      const handlePress = async () => {
        setEmailError("");
        const response = await Post({
          url: "/auth/sendForgotPasswordEmail",
          data: { email: values.email },
          setErrors: (errors) => setEmailError(errors.email),
        });

        if (response.success) {
          navigate("/verify-otp", { state: { email: values.email } });
        } else {
          setEmailError(response?.error);
        }
      };
      handlePress();
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <p>
          Enter your email and we will send you the OTP to reset your password.
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="you@example.com"
            />
            {(formik.touched.email && formik.errors.email) || emailError ? (
              <div className="error">{formik.errors.email || emailError}</div>
            ) : null}
          </div>

          <button type="submit" className="submit-btn">
            Send OTP
          </button>
        </form>
        <div className="auth-link">
          Remember your password? <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
