import mongoose from 'mongoose';

// Flexible schema for each message in the practice conversation
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  grammarCorrections: [
    {
      originalText: String,
      correctedText: String,
      explanation: String,
    }
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default_user', 
    index: true,
  },
  topic: {
    type: String,
    default: 'General Conversation', 
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active', 
  },
  messages: [MessageSchema],
}, {
  timestamps: true 
});

export default mongoose.model('Conversation', ConversationSchema);