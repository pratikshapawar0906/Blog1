import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config()
import Routes from "./router/Router.js"
import bodyParser from "body-parser";




const PORT = process.env.PORT || 4000
const app=express();



dotenv.config();
app.use(cors());
app.use(express.json());


app.use("/api", Routes);
connectDB();
app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})