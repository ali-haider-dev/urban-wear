import { useFormik } from "formik";
import * as Yup from "yup";
import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../Api";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Password is Required"),
});

const ForgotPassword = () => {
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
      const handlePress = async () => {
        setEmailError("");
        const data = {
          email: values.email,
        };

        const response = await Post({
          url: "/auth/sendForgotPasswordEmail",
          data: data,
          setErrors: (errors) => {
            setEmailError(errors.email);
          },
        });

        console.log(response.success);

        if (response.success) {
          // ToastAndroid.show("OTP Sent successfully", ToastAndroid.SHORT);
          navigate("/verify-otp", { state: { email: values.email } });
        } else {
          console.log("OTP  failed:", response.error);
          setEmailError(response?.error);
        }
      };
      handlePress();
    },
  });
  console.log(emailError);
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <p>Enter your email and we will send you the otp on your email.</p>
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
              <div className="error">{formik.errors.email || emailError}</div>
            ) : (
              <div className="error text-left">{emailError}</div>
            )}
          </div>

          <button className="bg-blue-600 w-full text-white px-[15px] py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 transition transform hover:scale-105">
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
