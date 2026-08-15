import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: false,
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    profileImage: {
        type: String,
    },

}, { timestamps: true });

const SignupModel = mongoose.model("User", signupSchema);

export default SignupModel;