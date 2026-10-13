
import api from "./axios";

export const getHostels = async () => {
  const response = await api.get("hostels/");
  return response.data;
};

export const createHostel = async (hostelData) => {
  const response = await api.post("hostels/", hostelData);
  return response.data;
};

export const deleteHostel = async (id) => {
  const response = await api.delete(`hostels/${id}/`);
  return response.data;
};