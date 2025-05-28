import { useFormik } from "formik";
import * as Yup from "yup";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Post } from "../../Api";

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/\d/, "Password must have at least one digit")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must have at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ResetPassword = () => {
  const location = useLocation();
  const { email, reset_token } = location.state || {};
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      const handlePress = async () => {
        const data = {
          password: values.password,
          resetPasswordToken: reset_token,
          email: email,
        };

        const response = await Post({
          url: "/auth/resetPassword",
          data,
          setErrors: () => {},
        });

        if (response.success) {
          navigate("/login");
        }
      };
      handlePress();
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 style={{color:'#e15600'}}>Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter a new password for <strong>{email}</strong>
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="error">{formik.errors.confirmPassword}</div>
              )}
          </div>

          <button type="submit" className="submit-btn">
            Reset
          </button>
        </form>

        <div className="auth-link">
          Remembered your password? <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
