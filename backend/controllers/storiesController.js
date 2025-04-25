const Story = require("../models/Story"); // Adjust path to your Story model

// Submit a story
exports.submitStory = async (req, res) => {
  try {
    const { title, body, tags, isAnonymous } = req.body;
    const author = req.user.id; 

    const story = await Story.create({
      title,
      body,
      tags: tags || [],
      isAnonymous: isAnonymous || false,
      author,
    });

    res.status(201).json({ message: "Story submitted successfully", story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get stories based on approvalStatus
exports.getStoriesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['new', 'pending', 'published', 'on-hold', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid approval status" });
    }

    const stories = await Story.find({ approvalStatus: status }).populate("author", "username email");
    res.status(200).json({ stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
