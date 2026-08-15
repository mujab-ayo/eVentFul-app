import { Schema, model } from "mongoose";

const reminderSchema = new Schema(
  {
        eventId: {
            type: Schema.Types.ObjectId,
          ref: "Event",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        triggerMinutesBefore: {
            type: Number,
            required: true,
        },
        channel: {
            type: String,
            enum: ["email", "sms", "push"],
            default: "email",
        },
        sent: {
            type: Boolean,
            default: false,
        },
  },
  { timestamps: true },
);


export default model("Reminder", reminderSchema);
