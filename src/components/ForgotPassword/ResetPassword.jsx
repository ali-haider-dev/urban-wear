import { useFormik } from "formik";
import * as Yup from "yup";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Post } from "../../Api";
const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Passwords must have at least one uppercase ('A'-'Z').")
    .matches(/\d/, "Passwords must have at least one digit ('0'-'9').")
    .matches(
      /[^a-zA-Z0-9]/,
      "Passwords must have at least one non alphanumeric character."
    )
    .required("password field is required"),
 confirmPassword: Yup.string()
  .required("Confirm Password field is required")
  .test("passwords-match", "Passwords must match", function (value) {
    return this.parent.password === value;
  }),
});

const ResetPassword = () => {
  const location = useLocation();
  const { email, reset_token } = location.state || {};
  const navigate = useNavigate();
  console.log("Email:", email);
  console.log("Token:", reset_token);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);

      const handlePress = async () => {
        const data = {
          password: values.password,
          resetPasswordToken: reset_token,
          email: email,
        };

        const response = await Post({
          url: "/auth/resetPassword",
          data: data,
          setErrors: (errors) => {},
        });

        console.log(response.success);

        if (response.success) {
          navigate("/login");
        } else {
          console.log(response.success);
        }
      };
      handlePress();
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Reset Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Reset Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <button
         
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 transition transform hover:scale-105"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
