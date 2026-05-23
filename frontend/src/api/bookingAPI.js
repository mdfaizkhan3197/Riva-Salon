import axiosInstance from "../utils/axiosInstance";

export const createBooking = async (data) => {
  try {
    const response = await axiosInstance.post("booking/create/", data);

    return response.data;

  } catch (error) {
    console.log("Booking API Error:", error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired, please login again ❌");
      window.location.href = "/login";
    }

    throw error;
  }
};