import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    expectedAttendees: {
      type: Number,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isOwner: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);


export default model("Event", eventSchema);
