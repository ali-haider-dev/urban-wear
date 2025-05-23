import axios from "axios";

const BASE_URL = "https://urbanwear.naveedportfolio.com/api";
export const Post = async ({
  url,
  data,
  showError = true,
  token,
  setErrors = () => {},
}) => {
  try {
    const isFormData = data instanceof FormData;

    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers,
    });

    if (response.data.isSuccess === false) {
     
      if (Array.isArray(response.data.errors)) {
        return { success: false, error: response.data.errors[0] };
      }

      return { success: false, error: "Something went wrong." };
    }

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 400) {
      const errors = error.response.data.errors;

      if (typeof errors === "object" && !Array.isArray(errors)) {
        // Field-based errors (e.g., { Name: ["error message"] })
        let errorObj = {};

        Object.keys(errors).forEach((key) => {
          errorObj[key] = errors[key][0];
        });

        setErrors(errorObj);
      }

      if (Array.isArray(errors)) {
        // Simple error array (e.g., ["Name already used."])
        return { success: false, error: errors[0] };
      }
    }

    if (showError) {
      console.error("API Error:", error.response?.data || error.message);
    }

    return { success: false, error: error?.response?.data?.message || "Something went wrong." };
  }
};


export const Get = async ({ url, data, token }) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: data,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    // ToastAndroid.show(
    //   error.response?.data?.message || error.message,
    //   ToastAndroid.SHORT,
    // );
    return { success: false, error: error?.response?.data?.message };
  }
};

export const Put = async ({ url, token, data, id, setErrors = () => {} }) => {
  try {
    // If id exists, append it to the URL; otherwise, use the URL without id
    const requestUrl = id ? `${BASE_URL}${url}/${id}` : `${BASE_URL}${url}`;

    const response = await axios.put(requestUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 400) {
      const messages = error.response.data.message;

      let errorObj = {};
      Object.keys(messages).forEach((key) => {
        errorObj[key] = messages[key][0];
      });

      setErrors(errorObj);
    }

    // ToastAndroid.show(
    //   error.response?.data?.message || error.message,
    //   ToastAndroid.SHORT,
    // );

    return { success: false, error: error?.response?.data?.message };
  }
};

export const Delete = async ({ url, data, token }) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data, // axios supports sending data in DELETE requests
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    // ToastAndroid.show(
    //   error.response?.data?.message || error.message,
    //   ToastAndroid.SHORT,
    // );

    return { success: false, error: error?.response?.data?.message };
  }
};

// import { useIsFocused } from '@react-navigation/native';
// const isFocused = useIsFocused();

// useEffect(() => {
//   if (isFocused) {
//      console.log('In inFocused Block', isFocused);
//      loadData();
//   }
// }, [isFocused]);
