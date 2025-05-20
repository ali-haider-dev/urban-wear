import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { Post } from "../../Api";
import { useState } from "react";

const LoginSchema = Yup.object().shape({
  otp: Yup.string().required("Otp field is Required"),
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
      // Handle form submission here
      console.log(values);
      const handlePress = async () => {
        setOtpError("");
        const data = {
          otp: values.otp,
          email: email,
        };

        const response = await Post({
          url: "/auth/verifyOTP",
          data: data,
          setErrors: (errors) => {},
        });

        console.log(response.success);

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
        <h2>Verify OTP</h2>
        <p className="my-4 color-gray">
          Enter the 6 digit OTP sent to your email
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              name="otp"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
            />
            {formik.touched.otp && formik.errors.otp ? (
              <div className="error">{formik.errors.otp}</div>
            ) : (
              <div className="error">{OtpError}</div>
            )}
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 transition transform hover:scale-105">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
