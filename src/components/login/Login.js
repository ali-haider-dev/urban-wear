import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { login } from "../../firebase";
import { Post } from "../../Api";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
      const handlePress = async () => {
        setLoading(true);
        const data = {
          userName: values.userName,
          password: values.password,
        };
        const response = await Post({
          url: "/auth/login",
          data: data,
          setErrors: (errors) => {
            formik.setErrors(errors);
          },
          showError: false,
        });

        if (response.success) {
          setLoading(true);
          console.log("Login successful", response.data);
          await localStorage.setItem("token", response.data.bearerToken);
          await localStorage.setItem("user", JSON.stringify(response.data));
          setUser(response.data);
          // navigate("/admin/dashboard")
          // navigate("/login");
        } else {
          console.log("Login failed:", response.error);
          toast.error(`Login failed:${response.error}`);
          setLoading(true);
        }
      };
      handlePress();
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log in</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Email address</label>
            <input
              id="userName"
              name="userName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="error">{formik.errors.userName}</div>
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
          <p className="auth-link text-left my-2">
            Forgot your password? <Link to="/forgot-password">Reset</Link>
          </p>
          <button className="bg-blue-600 w-full text-white px-[15px] py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 transition transform hover:scale-105">
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
