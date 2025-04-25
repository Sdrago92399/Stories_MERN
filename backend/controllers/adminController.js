const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Story = require("../models/Story");
const Gmail = require("../utils/emailService");
const dotenv = require("dotenv");

dotenv.config();

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieves all users from the database
    res.status(200).json(users); // Sends the list of users in the response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { username, email, password, role, isActive } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user's last login time
exports.getLastLogin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ lastLoginTime: user.lastLoginTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate a user
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add or update user roles
exports.addUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send email to a user
exports.sendEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subject, message } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await Gmail.sendMail({
      from: process.env.SENDER_GMAIL_MAIL,
      to: user.email,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change admin's own password
exports.changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change Story Status and Notify Author
exports.changeStoryStatus = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'pending', 'published', 'on-hold', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const story = await Story.findById(storyId).populate("author", "email username");
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    story.approvalStatus = status;
    await story.save();

    if (status === "published" || status === "rejected") {
      const subject = status === "published" ? "Your Story Has Been Published!" : "Your Story Has Been Rejected";
      const message =
        status === "published"
          ? `<p>Hi ${story.author.username},</p>
             <p>Congratulations! Your story titled <strong>"${story.title}"</strong> has been published.</p>
             <p>Thank you for sharing your story with us.</p>`
          : `<p>Hi ${story.author.username},</p>
             <p>We're sorry to inform you that your story titled <strong>"${story.title}"</strong> has been rejected.</p>
             <p>Feel free to contact support for more information.</p>`;

      await Gmail.sendMail({
        from: process.env.SENDER_GMAIL_MAIL,
        to: story.author.email,
        subject,
        html: message,
      });
    }

    res.status(200).json({ message: "Story status updated and notification sent", story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
