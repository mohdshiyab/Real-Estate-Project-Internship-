import api from "./api";

export const getProperties = (params = {}) =>
  api.get("/properties", { params }).then((r) => r.data);

export const getProperty = (id) =>
  api.get(`/properties/${id}`).then((r) => r.data);

export const createProperty = (payload) =>
  api.post("/properties", payload).then((r) => r.data);

export const updateProperty = (id, payload) =>
  api.put(`/properties/${id}`, payload).then((r) => r.data);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`).then((r) => r.data);
