import api from "./api";

// Submit customer interest on a property
export const submitInquiry = async (data) => {
  const res = await api.post("/inquiries", data);
  return res.data;
};

// Seller: get inquiries for properties owned by this seller
export const getSellerInquiries = async () => {
  const res = await api.get("/inquiries/seller");
  return res.data;
};

// Buyer: get inquiries submitted by this buyer
export const getBuyerInquiries = async () => {
  const res = await api.get("/inquiries/buyer");
  return res.data;
};

// Seller: update inquiry status (e.g. contacted, pending, closed)
export const updateInquiryStatus = async (id, status) => {
  const res = await api.patch(`/inquiries/${id}/status`, { status });
  return res.data;
};
