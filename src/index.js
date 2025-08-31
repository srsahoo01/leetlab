import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js"
import probelmRoutes from './routes/problems.routes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello guys welcom to leetlab_demo 🔥🔥🔥🔥")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", probelmRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})