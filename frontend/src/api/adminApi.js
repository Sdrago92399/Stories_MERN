// File: api/adminApi.js
import axiosInstance from "@/api/axios";

/**
 * Fetch all users (admin only)
 */
export const fetchAllUsersApi = async () => {
  try {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Add a new user (admin only)
 * @param {Object} payload - { username, email, password, role, isActive }
 */
export const addUserApi = async (payload) => {
  try {
    const response = await axiosInstance.post("/admin/users", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

/**
 * Delete a user by ID (admin only)
 * @param {string} userId
 */
export const deleteUserApi = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Get a user's last login time (admin only)
 * @param {string} userId
 */
export const getUserLastLoginApi = async (userId) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}/last-login`);
    return response.data;
  } catch (error) {
    console.error("Error fetching last login:", error);
    throw error;
  }
};

/**
 * Deactivate a user (admin only)
 * @param {string} userId
 */
export const deactivateUserApi = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

/**
 * Change user role (admin only)
 * @param {string} userId
 * @param {string} role - "user", "editor", "admin", etc.
 */
export const changeUserRoleApi = async (userId, role) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error changing user role:", error);
    throw error;
  }
};

/**
 * Send email to a user (admin only)
 * @param {string} userId
 * @param {Object} payload - { subject, message }
 */
export const sendUserEmailApi = async (userId, payload) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/send-email`, payload);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Change admin's own password (admin only)
 * @param {Object} payload - { currentPassword, newPassword }
 */
export const changeAdminPasswordApi = async (payload) => {
  try {
    const response = await axiosInstance.patch("/admin/admin/change-password", payload);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Change story status (admin only)
 * @param {string} storyId
 * @param {string} status - "new", "pending", "published", "on-hold", "rejected"
 */
export const changeStoryStatusApi = async (storyId, status) => {
  try {
    const response = await axiosInstance.patch(`/admin/stories/${storyId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error changing story status:", error);
    throw error;
  }
};

/**
 * Fetch stories by approval status (admin only)
 * @param {string} status - "new", "pending", "published", "on-hold", "rejected"
 */
export const fetchStoriesByStatusApi = async (status) => {
  try {
    const response = await axiosInstance.get(`/stories/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};