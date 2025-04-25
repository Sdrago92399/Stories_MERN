const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
  },
  body: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    default: [],    
  },
  isAnonymous: {
    type: Boolean,
    default: false, 
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  approvalStatus: {
    type: String,
    default: 'new', 
    enum: ['new', 'pending', 'published', 'on-hold', 'rejected'], 
  },
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
