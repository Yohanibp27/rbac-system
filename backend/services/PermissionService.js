import { Permission } from "../models/association.js";

const getAllPermissions = async () => {
  const permissions = await Permission.findAll({
    order: [["id", "ASC"]],
  });

  return permissions;
};

export default {
  getAllPermissions,
};
