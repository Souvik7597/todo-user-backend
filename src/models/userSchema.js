import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: String,
        default: false
    },
    isLoggedIn: {
        type: String,
        default: false
    },
    token: {
        type: String,
        default: null
    }
},{timestamps : true})

export default mongoose.model("user", userSchema)