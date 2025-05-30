import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./payment.css";
import { Post } from "../../Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const PaymentInfo = () => {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      postalCode: Yup.string()
        .matches(/^\d{5,6}$/, "Postal Code must be 5 or 6 digits")
        .required("Postal Code is required"),
      phone: Yup.string()
        .matches(/^\d{10,15}$/, "Phone number must be 10-15 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form submitted with values:", values);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }
        const data = {
          shippingAddress: values.address,
          city: values.city,
          state: values.state,
          zip: values.postalCode,
          paymentMethod: 0,
        };
        const response = await Post({
          url: "/order/cart",
          data: values,
          token,
        });

        if (response?.success) {
          console.log("Order placed successfully:", response.data);
          toast.success("Order placed successfully")
          resetForm()
          navigate('/orders')
          // Optionally, redirect or show a success message

        } else {
          toast.error(`Error placing order: ${response.error}`);
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
      }
    },
  });
  return (
    <div className="max-w-md mx-auto mt-10 p-6 mb-3 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Payment Information
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            name="address"
            className="appearance-none w-full px-4 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ color: "red !important" }}
            >
              {formik.errors.address}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 font-semibold">City</label>
          <input
            type="text"
            name="city"
            className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.city && formik.errors.city && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ color: "red !important" }}
            >
              {formik.errors.city}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 font-semibold">State</label>
          <input
            type="text"
            name="state"
            className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.state && formik.errors.state && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ color: "red !important" }}
            >
              {formik.errors.state}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block mb-1 font-semibold">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ color: "red !important" }}
            >
              {formik.errors.postalCode}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p
              className="text-red-500 text-sm mt-1"
              style={{ color: "red !important" }}
            >
              {formik.errors.phone}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          // disabled={!formik.isValid || formik.isSubmitting}
          // onClick={formik.handleSubmit}
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition duration-300"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default PaymentInfo;
