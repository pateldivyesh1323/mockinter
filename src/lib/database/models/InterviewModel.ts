import mongoose, { Schema } from "mongoose";

const interviewModel = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
  },
  interviewee: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    default: "upcoming" // Three states of interviews : upcoming, booked, completed
  },
});

const Interview =
  mongoose.models.Interview || mongoose.model("Interview", interviewModel);

export default Interview;
