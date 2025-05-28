import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Post } from "../../Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import logo from "../../utils/logo.png"; // Adjust the path as necessary
import login from "../../utils/Login.png"; // Adjust the path as necessary
const LoginSchema = Yup.object().shape({
  userName: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login({ setUser }) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const response = await Post({
        url: "/auth/login",
        data: { userName: values.userName, password: values.password },
        setErrors: (errors) => formik.setErrors(errors),
        showError: false,
      });

      if (response.success) {
        localStorage.setItem("token", response.data.bearerToken);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        toast.success("Login successful");
      } else {
        toast.error(`Login failed: ${response.error}`);
      }
      setLoading(false);
    },
  });

  return (
    <MDBContainer className="my-5" >
      <MDBCard>
        <MDBRow className="g-0">
          {/* Left Image */}
          <MDBCol md="6">
            <MDBCardImage
              src={login}
              alt="login form"
              className="rounded-start w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </MDBCol>

          {/* Right Form */}
          <MDBCol md="6" style={{backgroundColor:'#e4e2dd'}}>
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex flex-row mt-2 mb-4 align-items-center">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                {/* <span className="h1 fw-bold mb-0">Logo</span> */}
                <img src={logo} className="w-32 mx-auto" style={{height:'50%',width:'50%'}}/>
              </div>

              <h5
                className="fw-normal mb-4 pb-3 font-bold"
                style={{ letterSpacing: "1px", fontWeight:'bold !important' }}
              >
                Sign into your account
              </h5>

              <form onSubmit={formik.handleSubmit}>
                <MDBInput
                  wrapperClass="mb-3"
                  label="Email address"
                  id="userName"
                  name="userName"
                  type="email"
                  size="lg"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <div className="text-danger small mb-3">
                    {formik.errors.userName}
                  </div>
                )}

                <MDBInput
                  wrapperClass="mb-3"
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  size="lg"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger small mb-3">
                    {formik.errors.password}
                  </div>
                )}

                <MDBBtn
                  type="submit"
                  className="mb-4 px-5"
                  color="dark"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </MDBBtn>
              </form>

              <p className="small text-muted">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                Don't have an account? <Link to="/signup">Register here</Link>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Terms of use.
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
