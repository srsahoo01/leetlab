import jwt from 'jsonwebtoken';
import {db} from "../libs/db.js"
export const authMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ message: 'Unauthirized - No token provided' });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log('JWT Verification Error:', error);
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const checkAdmin =async(req,res,next)=>{
    try {
        const userId = req.user.id
        const user = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true
            }
        })
        if (user.role !== "ADMIN"){
            return res.status(403).json({message:"Forbidden - Admins only"})    
        }
        next()
    } catch (error) {
        console.error('Check Admin Middleware Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}