import api from "./api";

const getMyProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

const updateMyProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.patch("/profile/password", passwordData);

  return response.data;
};

const ProfileService = {
  getMyProfile,
  updateMyProfile,
  changePassword,
};

export default ProfileService;
