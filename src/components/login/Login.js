import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import "./index.css"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
})

const Login=()=> {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values)
    },
  })

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
            {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
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
          <button type="submit" className="submit-btn">
            Log in
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/Signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

