// Property schema — supports all types of estates: Residential, Land & Plots, Commercial
const mongoose = require("mongoose");

const RESIDENTIAL_TYPES = ["Villa", "Apartment", "House", "Penthouse", "Mansion", "Townhouse", "Studio"];
const LAND_TYPES = ["Land", "Plot", "Vineyard", "Private Island", "Farm Land", "Commercial Land"];
const COMMERCIAL_TYPES = ["Commercial Building", "Boutique Hotel", "Office Space", "Warehouse"];
const ALL_TYPES = [...RESIDENTIAL_TYPES, ...LAND_TYPES, ...COMMERCIAL_TYPES];

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    estateCategory: {
      type: String,
      enum: ["residential", "land", "commercial"],
      default: "residential",
    },
    propertyType: {
      type: String,
      enum: ALL_TYPES,
      default: "Villa",
    },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, default: 0, min: 0 },
    landAreaUnit: {
      type: String,
      enum: ["sq ft", "acres", "hectares", "sq m"],
      default: "sq ft",
    },
    zoning: { type: String, default: "", trim: true },
    status: { type: String, enum: ["sale", "rent"], default: "sale" },
    image: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

// Auto-classify estateCategory based on propertyType
propertySchema.pre("save", function (next) {
  if (LAND_TYPES.includes(this.propertyType)) {
    this.estateCategory = "land";
  } else if (COMMERCIAL_TYPES.includes(this.propertyType)) {
    this.estateCategory = "commercial";
  } else if (!this.estateCategory) {
    this.estateCategory = "residential";
  }
  next();
});

// Re-export createdAt as the API field expected by the frontend
propertySchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.createdAt = ret.createdAt || new Date().toISOString();
    return ret;
  },
});

module.exports = mongoose.model("Property", propertySchema);
