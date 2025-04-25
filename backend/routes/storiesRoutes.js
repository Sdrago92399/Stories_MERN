const express = require("express");
const { submitStory, getStoriesByStatus } = require("../controllers/storiesController");
const { verifyToken } = require("../middleware/authMiddleware"); 
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", verifyToken, submitStory);
router.get("/:status", verifyToken, isAdmin, getStoriesByStatus);

module.exports = router;
