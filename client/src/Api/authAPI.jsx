import api from "./axios";

export const loginRequest = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data; //message: "Login successful",user: userData,accessToken: accesstoken, refreshToken: refreshToken
  } catch (error) {
    throw error.response.data;
  }
};

export const registerRequest = async (email, password, role) => {
  try {
    const response = await api.post("/auth/register", { email, password, role });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const logoutRequest = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const changePasswordRequest = async (userId, oldPassword, newPassword) => {
  try {
    const response = await api.put("/auth/changePassword", { userId, oldPassword, newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};