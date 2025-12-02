import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import { verifyMail } from "../emailVerify/verifyMail.js";

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const existing = await userSchema.findOne({ email })
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User Already Exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userSchema.create({ userName, email, password: hashedPassword })

        const token = jwt.sign({id : user._id},process.env.secretKey,{
            expiresIn : "5m"
        } )

        user.token = token
        await user.save()
        console.log(token)
        verifyMail(token, email)


        if (user) {
            return res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                user
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}