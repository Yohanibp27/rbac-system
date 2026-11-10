import api from "./api";

const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

const assignRole = async (id, roleName) => {
  const response = await api.patch(`/users/${id}/role`, { roleName });
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

const UserService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  assignRole,
  deleteUser,
};

export default UserService;
