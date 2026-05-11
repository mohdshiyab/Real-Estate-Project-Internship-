// Property schema
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    propertyType: {
      type: String,
      enum: ["Villa", "Apartment", "House", "Penthouse", "Studio", "Land"],
      default: "Villa",
    },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["sale", "rent"], default: "sale" },
    image: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true },
);

// Re-export createdAt as the API field expected by the frontend
propertySchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.createdAt = ret.createdAt || new Date().toISOString();
    return ret;
  },
});

module.exports = mongoose.model("Property", propertySchema);
