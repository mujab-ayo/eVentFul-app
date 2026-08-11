import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid"],
      default: "pending",
    },
    ticketQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Order", orderSchema);
