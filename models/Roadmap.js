 
const mongoose = require('mongoose');

// Define the schema for a Roadmap document
const roadmapSchema = new mongoose.Schema({

  // ID of the user who owns this roadmap
  userId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB reference ID
    ref: 'User', // Refers to the User model
    required: true
  },

  // ID of the goal this roadmap is associated with
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  // Title of the roadmap (e.g., "Learn Web Development")
  title: {
    type: String,
    required: true
  },

  // Short description of the roadmap
  description: {
    type: String,
    required: true
  },

  // Category (e.g., "Programming", "AI", etc.)
  category: {
    type: String,
    required: true
  },

  // Total duration in days to complete the roadmap
  totalDuration: {
    type: Number, // Measured in days
    required: true
  },

  // Difficulty level (selected from enum options)
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },

  // Roadmap is divided into multiple phases
  phases: [{
    phaseNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // in days
      required: true
    },

    // Each phase contains multiple topics
    topics: [{
      topicNumber: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: String,

      // Estimated time in hours to learn the topic
      estimatedTime: {
        type: Number,
        required: true
      },

      // Learning resources for the topic
      resources: [{
        type: {
          type: String,
          enum: ['article', 'video', 'book', 'course', 'practice', 'project'],
          required: true
        },
        title: String,
        url: String,
        description: String,
        isPremium: {
          type: Boolean,
          default: false
        }
      }],

      // Skills learned in this topic
      skills: [String],

      // Prerequisites to learn this topic
      prerequisites: [String],

      // Whether the topic is completed
      isCompleted: {
        type: Boolean,
        default: false
      },

      // Date when the topic was completed
      completedAt: Date
    }]
  }],

  // Who generated this roadmap: AI, admin, or user
  generatedBy: {
    type: String,
    enum: ['ai', 'admin', 'user'],
    default: 'ai'
  },

  // The AI prompt used (if applicable)
  aiPrompt: String,

  // Status of the roadmap (active, paused, completed)
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },

  // Progress tracking object
  progress: {
    completedTopics: {
      type: Number,
      default: 0
    },
    totalTopics: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  },

  // Timestamp when the roadmap was created
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Timestamp when the roadmap was last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// Pre-save hook to auto-calculate progress metrics before saving the document
roadmapSchema.pre('save', function(next) {

  // Calculate total number of topics across all phases
  this.progress.totalTopics = this.phases.reduce((total, phase) => {
    return total + phase.topics.length;
  }, 0);

  // Count number of completed topics
  this.progress.completedTopics = this.phases.reduce((total, phase) => {
    return total + phase.topics.filter(topic => topic.isCompleted).length;
  }, 0);

  // Calculate completion percentage
  this.progress.completionPercentage = this.progress.totalTopics > 0 
    ? Math.round((this.progress.completedTopics / this.progress.totalTopics) * 100)
    : 0;

  // Update the updatedAt timestamp
  this.updatedAt = Date.now();

  // Proceed to save
  next();
});

// Export the model to use it in controllers/services
module.exports = mongoose.model('Roadmap', roadmapSchema);
