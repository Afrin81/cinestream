import API from "./api.js";

// ✅ Register user
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    const userToSave = {
      ...response.data.user,
      token: response.data.token,
    };
    localStorage.setItem("currentUser", JSON.stringify(userToSave));
    return { success: true, user: userToSave };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};

// ✅ Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    const userToSave = {
      ...response.data.user,
      token: response.data.token,
    };
    localStorage.setItem("currentUser", JSON.stringify(userToSave));
    return { success: true, user: userToSave };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// ✅ Logout user
export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  return { success: true };
};

// ✅ Get current user
export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user || null;
};

// ✅ Update user in localStorage (after payment)
export const updateCurrentUser = (updatedUser) => {
  const current = JSON.parse(localStorage.getItem("currentUser"));
  if (current) {
    const updated = { ...current, ...updatedUser };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    return updated;
  }
  return null;
};