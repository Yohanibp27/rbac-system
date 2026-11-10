import api from "./api";

const getAllRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

const updateRolePermissions = async (id, permissionIds) => {
  const response = await api.put(`/roles/${id}/permissions`, {
    permissionIds,
  });

  return response.data;
};

const RoleService = {
  getAllRoles,
  updateRolePermissions,
};

export default RoleService;
