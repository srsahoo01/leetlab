import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const exstingUser = await db.user.findUnique({
            where: { email },
        });

        if (exstingUser)
            return res.status(400).json({ message: "User already exists" });
        console.log("I am after the res.status ")
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: UserRole.USER,
            },
        });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "devlopment",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });


    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await db.user.findUnique({
            where: { email }
        })

        if (!user) return res.status(401).json({ message: "Invalid credentials" })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "devlopment",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        })
    } catch (error) {
        console.log("Error in login function:")
        console.log(error)
        return res.status(500).json({ message: "Something went wrong " })
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "devlopment",
            sameSite: "strict"
        })
        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.log("Error in logout function:")
        console.log(error)
        return res.status(500).json({ message: "Something went wrong" })
    }
};

export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        })
    } catch (error) {
        console.log("Error in check function:")
        console.log(error)
        return res.status(500).json({ message: "Something went wrong" })
    }
};
