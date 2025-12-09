import express from "express"
import { login, logout, register } from "../controllers/userController.js"
import { verification } from "../middleware/verifyToken.js"
import { hasToken } from "../middleware/hasToken.js"

const userRoute = express.Router()

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.get("/verify", verification)
userRoute.delete("/logout", hasToken,logout)

export default userRoute