import Role from "./Role.js";
import Permission from "./Permission.js";
import User from "./User.js";
import RolePermission from "./RolePermission.js";

// Relasi Role dan User (One-to-Many)
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

// Relasi Role dan Permission (Many-to-Many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

export { Role, Permission, User, RolePermission };
