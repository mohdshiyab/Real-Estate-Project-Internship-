// User schema — supports Seller (Dealer) and Buyer (Customer) roles
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["seller", "buyer", "dealer"],
      default: "buyer",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    agency: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Standardize role: treat "dealer" as "seller"
userSchema.pre("save", function (next) {
  if (this.role === "dealer") this.role = "seller";
  next();
});

module.exports = mongoose.model("User", userSchema);
