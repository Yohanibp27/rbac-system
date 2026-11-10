import api from "./api";

const getAllPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

const PermissionService = {
  getAllPermissions,
};

export default PermissionService;
