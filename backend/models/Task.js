import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    dueDate: {
      type: Date,
    },
    submissionLink: {
      type: String,
    },

    submissionFile: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.pre("save", function () {
  if (this.isNew && this.duration) {
    const now = new Date();

    this.dueDate = new Date(
      now.getTime() + this.duration * 24 * 60 * 60 * 1000,
    );
  }
});

export default mongoose.model("Task", taskSchema);
