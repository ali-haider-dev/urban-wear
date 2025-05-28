import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const PaymentInfo = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      postalCode: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      address: Yup.string().required("Address is required"),
      postalCode: Yup.string()
        .matches(/^\d{5,6}$/, "Postal Code must be 5 or 6 digits")
        .required("Postal Code is required"),
      phone: Yup.string()
        .matches(/^\d{10,15}$/, "Phone number must be 10-15 digits")
        .required("Phone number is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 mb-3  rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Payment Information
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            name="address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block mb-1 font-semibold">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition duration-300"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentInfo;
