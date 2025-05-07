// const mongoose = require("mongoose");

// const TaskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   dueDate: Date,
//   priority: {
//     type: String,
//     enum: ["Low", "Medium", "High"],
//     default: "Medium",
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "In Progress", "Completed"],
//     default: "Pending",
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Task", TaskSchema);
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],  // Ensure that priority is restricted to these values
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],  // Ensure that status is restricted to these values
    required: true,
  },
  assignee: {
    type: String,
    required: false,  // Optional, if you want to assign tasks
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming you have a User model, this can be updated based on your user model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming the user ID refers to a User model
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
