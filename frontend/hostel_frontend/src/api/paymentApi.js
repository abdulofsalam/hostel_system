
import api from "./axios";

// Get payments belonging to the logged-in owner
export const getPayments = async () => {
  const response = await api.get("payments/");
  return response.data;
};

// Create a payment
export const createPayment = async (paymentData) => {
  const response = await api.post("payments/", paymentData);
  return response.data;
};

// Update an existing payment
export const updatePayment = async (paymentId, paymentData) => {
  const response = await api.put(
    `payments/${paymentId}/`,
    paymentData
  );
  return response.data;
};

// Delete a payment
export const deletePayment = async (paymentId) => {
  const response = await api.delete(`payments/${paymentId}/`);
  return response.data;
};
