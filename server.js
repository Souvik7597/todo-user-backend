import express from "express";
import { dbConnect } from "./src/config/dbConnect.js";
import dotenv from "dotenv/config"
import userRoute from "./src/routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 7000;

app.use(express.json())
app.use("/user",userRoute)

dbConnect();

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})