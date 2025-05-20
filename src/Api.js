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
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers,
    });

    if (response.data.isSuccess === false) {
      console.log("Api error",response.data)
      return { success: false, error: response.data.errors[0] };
    }
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 400) {
      const messages = error.response.data.message;

      //Dynamically create error object from API response
      let errorObj = {};
      Object.keys(messages).forEach((key) => {
        errorObj[key] = messages[key][0]; //error messages ki objects destructuring
      });

      setErrors(errorObj);
    } else {
      console.log("Error response", error.response?.data?.message);
      if (showError) {
        // ToastAndroid.show(
        //   error.response?.data?.message || error.message,
        //   ToastAndroid.SHORT,
        // );
        console.error("API Error:", error.response?.data || error.message);
      }

      return { success: false, error: error?.response?.data?.message };
    }
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
