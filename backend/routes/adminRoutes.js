const express = require("express");
const {
  deleteUser,
  addUser,
  getLastLogin,
  deactivateUser,
  addUserRole,
  sendEmail,
  changePassword,
  changeStoryStatus,
  getAllUsers
} = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware"); 
const { isAdmin } = require("../middleware/roleMiddleware");     

const router = express.Router();

// User management
router.delete("/users/:userId", verifyToken, isAdmin, deleteUser);
router.post("/users", verifyToken, isAdmin, addUser);            
router.get("/users/:userId/last-login", verifyToken, isAdmin, getLastLogin);
router.patch("/users/:userId/deactivate", verifyToken, isAdmin, deactivateUser);
router.patch("/users/:userId/role", verifyToken, isAdmin, addUserRole);
router.get("/users", verifyToken, isAdmin, getAllUsers);

// Admin password management
router.patch("/admin/change-password", verifyToken, isAdmin, changePassword);

// Story management
router.patch("/stories/:storyId/status", verifyToken, isAdmin, changeStoryStatus);
router.post("/users/:userId/send-email", verifyToken, isAdmin, sendEmail);

module.exports = router;
