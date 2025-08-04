//use npm install express to get express
//npm init -y for json file

/*"scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }

  used to be able to do npm run dev (for dev scripts)
  use for when we want to run the whole application (npm run start)
*/
import express from "express"
import cors from "cors"
import noteRoutes from "./routes/noteRoutes.js"
import{ connectDB } from "./config/db.js"
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5001

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use(rateLimiter)
  
app.use("/api/notes", noteRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT)
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error)
})

 