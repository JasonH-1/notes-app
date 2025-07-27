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
import noteRoutes from "./routes/noteRoutes.js"
import{ connectDB } from "./config/db.js"
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5001

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

 