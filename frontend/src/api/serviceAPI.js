import axiosInstance from "../utils/axiosInstance";

export const getServices = async () => {
  const response = await axiosInstance.get("services/");
  return response.data;
};