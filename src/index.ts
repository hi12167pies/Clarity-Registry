import express from "express"
import dotenv from "dotenv"
import { LibraryRouter } from "./router/library"

dotenv.config()

const app = express()

app.get("/", (req, res) => {
  res.send("Hello!")
})

app.use("/lib", LibraryRouter)

app.listen(process.env.PORT, () => {
  console.log("Service is online on port " + process.env.PORT)
})