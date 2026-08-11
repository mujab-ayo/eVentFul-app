import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    attendeeUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qrCodeToken: {
      type: String,
      required: true,
      unique: true,
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
    scannedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default model("Ticket", ticketSchema);
