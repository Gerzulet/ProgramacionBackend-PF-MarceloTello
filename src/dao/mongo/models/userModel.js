import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        min: 18,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "premium"] 
    },
    cartId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts' 
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

export const userModel = mongoose.model(userCollection, userSchema);
export default userModel;