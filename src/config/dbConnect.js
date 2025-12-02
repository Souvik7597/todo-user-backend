import mongoose from "mongoose";
import dotenv from 'dotenv/config'

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL)
        console.log("MongoDb Connected");
    } catch (error) {
        console.log("Database Not Connected");
        
    }
}