import express from "express";
import { dbConnect } from "./src/config/dbConnect.js";
import dotenv from "dotenv/config"
import userRoute from "./src/routes/userRoutes.js";
import todoRoute from "./src/routes/todoRoute.js";

const app = express();

const port = process.env.PORT || 7002;

app.use(express.json())
app.use("/user", userRoute)
app.use("/todo", todoRoute)


dbConnect();

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})