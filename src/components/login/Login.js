import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "./index.css";
import { login } from "../../firebase";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
      login(values.email, values.password)
        .then((user) => {})
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log in</h2>
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 transition transform hover:scale-105">
           Login
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/Signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
