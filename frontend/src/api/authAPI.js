import axios from "axios";

export const registerUser = async (data) => {
  const response = await axios.post(
    "https://riva-salon-backend.onrender.com/api/accounts/register/",
    data
  );

  return response.data;
};