import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
const app=express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
    connectDB();
})
