import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import { verifyMail } from "../emailVerify/verifyMail.js";
import sessionSchema from "../models/sessionSchema.js";

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

        const token = jwt.sign({ id: user._id }, process.env.secretKey, {
            expiresIn: "5m"
        })

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        } else {
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else if (passwordCheck && user.isVerified === true) {

                await sessionSchema.findOneAndDelete({ userId: user._id });

                await sessionSchema.create({ userId: user._id });

                const accessToken = jwt.sign(
                    {
                        id: user._id,
                    },
                    process.env.secretKey,
                    {
                        expiresIn: "10days",
                    }
                );

                const refreshToken = jwt.sign(
                    {
                        id: user._id,
                    },
                    process.env.secretKey,
                    {
                        expiresIn: "30days",
                    }
                );

                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User Logged in Successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    data: user,
                });
            } else {
                res.status(401).json({
                    message: "Complete Email verification then Login..",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {

    try {
        const existing = await sessionSchema.findOne({ userId: req.userId });
        const user = await userSchema.findById({ _id: req.userId })

        if (existing) {
            await sessionSchema.findOneAndDelete({ userId: req.userId });
            user.isLoggedIn = false
            await user.save()
            return res.status(200).json({
                success: true,
                message: "Session successfully ended",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User had no session",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};