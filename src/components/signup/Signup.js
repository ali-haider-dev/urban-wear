import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBRow,
  MDBCol,
  MDBCardImage,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Post } from "../../Api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../utils/logo.png";
import signup from "../../utils/signup.png";
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
    .matches(/[A-Z]/, "Must have at least one uppercase letter")
    .matches(/\d/, "Must have at least one digit")
    .matches(/[^a-zA-Z0-9]/, "Must include a special character")
    .required("Password field is required"),
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
          setLoading(false);
          navigate("/login");
        } else {
          console.log("Signup failed:", response.error);
          toast.error(`Signup Failed ${response.error}`);
          setLoading(false);
        }
      };

      handlePress();
    },
  });

  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className="g-0">
          {/* Left Image */}
          <MDBCol md="6">
            <MDBCardImage
              src={signup}
              alt="signup form"
              className="rounded-start w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </MDBCol>

          {/* Right Signup Form */}
          <MDBCol md="6" style={{ backgroundColor: "#e4e2dd" }}>
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex flex-row mt-2 mb-4 align-items-center">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                {/* <span className="h1 fw-bold mb-0">Logo</span> */}
                <img
                  src={logo}
                  className="w-32  mx-auto"
                  style={{ height: "50%", width: "50%" }}
                />
              </div>
              <h3
                className="mb-4 "
                style={{ letterSpacing: "1px", fontWeight: "bolder" }}
              >
                Create your account
              </h3>

              <form onSubmit={formik.handleSubmit}>
                <MDBInput
                  wrapperClass="mb-3"
                  label="Full Name"
                  id="name"
                  name="name"
                  type="text"
                  size="lg"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger small mb-3">
                    {formik.errors.name}
                  </div>
                )}

                <MDBInput
                  wrapperClass="mb-3"
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  size="lg"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger small mb-3">
                    {formik.errors.email}
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
                  className="mb-4 w-100"
                  size="lg"
                  color="dark"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign up"}
                </MDBBtn>
              </form>

              <p className="text-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-dark fw-bold">
                  Log in
                </Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Signup;
