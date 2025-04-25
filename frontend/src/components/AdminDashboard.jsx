import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/redux/dispatch/useAuth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import API services
import {
  fetchAllUsersApi,
  addUserApi,
  deleteUserApi,
  deactivateUserApi,
  changeUserRoleApi,
  sendUserEmailApi,
  changeAdminPasswordApi,
  changeStoryStatusApi,
  fetchStoriesByStatusApi,
} from "@/api/adminApi";

const AdminDashboard = () => {
  const { auth, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("users");
  
  // Users state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  });
  
  // Stories state
  const [stories, setStories] = useState([]);
  const [storyFilter, setStoryFilter] = useState("new");
  const [selectedStory, setSelectedStory] = useState(null);
  
  // Email state
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: ""
  });
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Alert state
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch stories when filter changes
  useEffect(() => {
    fetchStories(storyFilter);
  }, [storyFilter]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const userData = await fetchAllUsersApi();
      setUsers(userData);
    } catch (error) {
      showAlert("error", "Failed to fetch users");
      console.error(error);
    }
  };

  // Fetch stories by status
  const fetchStories = async (status) => {
    try {
      const storyData = await fetchStoriesByStatusApi(status);
      setStories(storyData.stories);
      console.log(storyData)
    } catch (error) {
      showAlert("error", "Failed to fetch stories");
      console.error(error);
    }
  };

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  // Handle user form changes
  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm({
      ...userForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle email form changes
  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value
    });
  };

  // Handle password form changes
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUserApi(userForm);
      setShowAddUserModal(false);
      setUserForm({
        username: "",
        email: "",
        password: "",
        role: "user",
        isActive: true
      });
      fetchUsers();
      showAlert("success", "User added successfully");
    } catch (error) {
      showAlert("error", error.response?.data?.error || "Failed to add user");
      console.error(error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserApi(userId);
      fetchUsers();
      setShowConfirmModal(false);
      showAlert("success", "User deleted successfully");
    } catch (error) {
      showAlert("error", "Failed to delete user");
      console.error(error);
    }
  };

  // Deactivate user
  const handleDeactivateUser = async (userId) => {
    try {
      await deactivateUserApi(userId);
      fetchUsers();
      setShowConfirmModal(false);
      showAlert("success", "User deactivated successfully");
    } catch (error) {
      showAlert("error", "Failed to deactivate user");
      console.error(error);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, role) => {
    try {
      await changeUserRoleApi(userId, role);
      fetchUsers();
      showAlert("success", "Role updated successfully");
    } catch (error) {
      showAlert("error", "Failed to update role");
      console.error(error);
    }
  };

  // Send email to user
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await sendUserEmailApi(selectedUser._id, emailForm);
      setShowEmailModal(false);
      setEmailForm({ subject: "", message: "" });
      showAlert("success", "Email sent successfully");
    } catch (error) {
      showAlert("error", "Failed to send email");
      console.error(error);
    }
  };

  // Change story status
  const handleChangeStoryStatus = async (storyId, status) => {
    try {
      await changeStoryStatusApi(storyId, status);
      fetchStories(storyFilter);
      showAlert("success", "Story status updated successfully");
    } catch (error) {
      showAlert("error", "Failed to update story status");
      console.error(error);
    }
  };

  // Change admin password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("error", "New passwords don't match");
      return;
    }
    try {
      await changeAdminPasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showAlert("success", "Password changed successfully");
    } catch (error) {
      showAlert("error", error.response?.data?.error || "Failed to change password");
      console.error(error);
    }
  };

  // Set up confirmation modal
  const setupConfirmModal = (action, user) => {
    setSelectedUser(user);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  // Execute confirmed action
  const executeConfirmedAction = () => {
    if (confirmAction === "delete") {
      handleDeleteUser(selectedUser._id);
    } else if (confirmAction === "deactivate") {
      handleDeactivateUser(selectedUser._id);
    }
  };

  return (
    <div className="min-h-screen w-screen text-black bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Header */}
      <header className="bg-indigo-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Change Password
          </button>
          <button
            onClick={logoutUser}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Alert */}
      {alert.show && (
        <div className={`p-4 m-4 rounded ${
          alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {alert.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex shadow-sm border-b">
        <button
          className={`px-6 py-3 mx-3 font-medium ${
            activeTab === "users" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "stories" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("stories")}
        >
          Story Management
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add New User
              </button>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleChangeRole(user._id, e.target.value)}
                          className="p-1 border rounded text-sm text-white"
                        >
                          <option value="sub-admin">Sub-Admin</option>
                          <option value="editor">Editor</option>
                          <option value="co-editor">Co-Editor</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEmailModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => setupConfirmModal("deactivate", user)}
                            className="text-yellow-600 hover:text-yellow-900"
                            disabled={!user.isActive}
                          >
                            Deactivate
                          </button>
                          <button
                            onClick={() => setupConfirmModal("delete", user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Story Management */}
        {activeTab === "stories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Story Management</h2>
              <div className="flex gap-2">
                <select
                  value={storyFilter}
                  onChange={(e) => setStoryFilter(e.target.value)}
                  className="p-2 border rounded text-white"
                >
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="on-hold">On Hold</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Stories Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stories.map((story) => (
                    <tr key={story._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {story.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {story.isAnonymous ? "Anonymous" : story.author?.username || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          story.approvalStatus === "published" ? "bg-green-100 text-green-800" :
                          story.approvalStatus === "rejected" ? "bg-red-100 text-red-800" :
                          story.approvalStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                          story.approvalStatus === "on-hold" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {story.approvalStatus.charAt(0).toUpperCase() + story.approvalStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStory(story);
                              // Open story view modal here
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                          <select
                            value={story.approvalStatus}
                            onChange={(e) => handleChangeStoryStatus(story._id, e.target.value)}
                            className="p-1 border rounded text-sm text-white"
                          >
                            <option value="new">New</option>
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                            <option value="on-hold">On Hold</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userForm.username}
                  onChange={handleUserFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={userForm.isActive}
                  onChange={handleUserFormChange}
                  className="mr-2"
                />
                <label htmlFor="isActive">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4">Send Email to {selectedUser.username}</h3>
            <form onSubmit={handleSendEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={emailForm.subject}
                  onChange={handleEmailFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <ReactQuill
                  value={emailForm.message}
                  onChange={(content) => setEmailForm({ ...emailForm, message: content })}
                  className="bg-white border rounded h-64"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFormChange}
                  className="bg-indigo-100 text-black rounded focus:outline-none focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  className="bg-indigo-100 text-black rounded focus:outline-none focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  className="bg-indigo-100 text-black rounded focus:outline-none focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {confirmAction === "delete" ? "Delete User" : "Deactivate User"}
            </h3>
            <p className="mb-6">
              {confirmAction === "delete"
                ? `Are you sure you want to delete ${selectedUser.username}? This action cannot be undone.`
                : `Are you sure you want to deactivate ${selectedUser.username}?`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className={`px-4 py-2 ${
                  confirmAction === "delete" ? "bg-red-600" : "bg-yellow-600"
                } text-white rounded hover:bg-opacity-90 transition`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;