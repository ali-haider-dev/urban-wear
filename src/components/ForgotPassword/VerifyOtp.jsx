import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { Post } from "../../Api";
import { useState } from "react";

const LoginSchema = Yup.object().shape({
  otp: Yup.string().required("OTP is required"),
});

const VerifyOtp = () => {
  const [OtpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      const handlePress = async () => {
        setOtpError("");
        const response = await Post({
          url: "/auth/verifyOTP",
          data: { otp: values.otp, email },
          setErrors: () => {},
        });

        if (response.success) {
          navigate("/reset-password", {
            state: {
              email: email,
              reset_token: response.data.resetPasswordToken,
            },
          });
        } else {
          setOtpError(response?.error);
        }
      };
      handlePress();
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 style={{color:'#e15600'}}>Verify OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              name="otp"
              type="number"
              placeholder="Enter OTP"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
            />
            {(formik.touched.otp && formik.errors.otp) || OtpError ? (
              <div className="error">{formik.errors.otp || OtpError}</div>
            ) : null}
          </div>

          <button
            type="submit"
            className="submit-btn"
          >
            Verify
          </button>
        </form>

        <div className="auth-link">
          Didn’t get the OTP? <a href="/forgot-password">Resend</a>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
