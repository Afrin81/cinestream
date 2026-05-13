import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 👤 User Schema — defines how user data is stored in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
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
      minlength: [6, "Password must be at least 6 characters"],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 🔐 Hash password before saving
// This runs automatically before every save
userSchema.pre("save", async function (next) {
  // only hash if password was changed
  if (!this.isModified("password")) return next();
  
  // hash the password with strength 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Method to check if password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;