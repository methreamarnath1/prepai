const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roadmap",
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30,
  },
  questions: [
    {
      questionNumber: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["mcq", "short_answer", "coding", "true_false", "fill_blank"],
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          optionLetter: {
            type: String,
            enum: ["A", "B", "C", "D", "E"],
          },
          text: String,
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      ],
      correctAnswer: String,
      explanation: String,
      points: {
        type: Number,
        default: 1,
      },
      tags: [String],
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
      },
    },
  ],
  totalQuestions: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  generatedBy: {
    type: String,
    enum: ["ai", "admin"],
    default: "ai",
  },
  aiPrompt: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate totals before saving
quizSchema.pre("save", function (next) {
  this.totalQuestions = this.questions.length;
  this.totalPoints = this.questions.reduce((total, q) => total + q.points, 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Quiz", quizSchema);
