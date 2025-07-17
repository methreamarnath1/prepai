const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
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
  quizAttempts: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
      },
      attemptNumber: {
        type: Number,
        required: true,
      },
      answers: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          userAnswer: mongoose.Schema.Types.Mixed,
          isCorrect: {
            type: Boolean,
            required: true,
          },
          pointsEarned: {
            type: Number,
            required: true,
          },
          timeSpent: Number, // in seconds
        },
      ],
      score: {
        correct: {
          type: Number,
          default: 0,
        },
        incorrect: {
          type: Number,
          default: 0,
        },
        totalQuestions: {
          type: Number,
          required: true,
        },
        totalPoints: {
          type: Number,
          required: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
      },
      timeSpent: {
        type: Number, // in seconds
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
      feedback: {
        strengths: [String],
        weaknesses: [String],
        suggestions: [String],
        nextSteps: [String],
      },
    },
  ],
  topicsCompleted: [
    {
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
      score: Number,
      timeSpent: Number,
    },
  ],
  overallProgress: {
    completedTopics: {
      type: Number,
      default: 0,
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    totalQuizzesTaken: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  analytics: {
    dailyActivity: [
      {
        date: {
          type: Date,
          required: true,
        },
        quizzesTaken: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    weeklyProgress: [
      {
        week: {
          type: String,
          required: true,
        },
        progressMade: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
      },
    ],
    strongTopics: [String],
    weakTopics: [String],
    studyStreak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastStudyDate: Date,
    },
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

// Update analytics before saving
progressSchema.pre("save", function (next) {
  // Update overall progress
  this.overallProgress.totalQuizzesTaken = this.quizAttempts.length;

  if (this.quizAttempts.length > 0) {
    const totalScore = this.quizAttempts.reduce(
      (sum, attempt) => sum + attempt.score.percentage,
      0
    );
    this.overallProgress.averageScore = Math.round(
      totalScore / this.quizAttempts.length
    );
  }

  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Progress", progressSchema);
