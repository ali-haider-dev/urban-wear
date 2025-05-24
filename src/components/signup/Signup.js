import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import { Post } from "../../Api";
import { useNavigate } from "react-router-dom";
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name field is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email field is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Passwords must have at least one uppercase ('A'-'Z').")
    .matches(/\d/, "Passwords must have at least one digit ('0'-'9').")
    .matches(
      /[^a-zA-Z0-9]/,
      "Passwords must have at least one non alphanumeric character."
    )
    .required("password field is required"),
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
      const handlePress = async () => {
        setLoading(true);
        const data = {
          fullName: values.name,
          email: values.email,
          password: values.password,
          role: 1,
        };
        const response = await Post({
          url: "/auth/signUp",
          data: data,
          setErrors: (errors) => {
            formik.setErrors(errors);
          },
          showError: false,
        });

        if (response.success) {
          setLoading(true);
          navigate("/login");
        } else {
          console.log("Signup failed:", response.error);
          setLoading(true);
        }
      };
      handlePress();
    },
  });
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign up</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="error">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
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
          {/* <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
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
          </div> */}
          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/Login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
