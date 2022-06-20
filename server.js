
import 'dotenv/config';
// const signin = require('./controllers/signin');

import helmet from "helmet";

import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import mongoose from "mongoose";

import bodyParser from 'body-parser'; 

import cors from "cors";

import express from 'express';
import cookieParser from "cookie-parser"; 

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import projectRoutes from "./routes/project.route.js";
import categoryRoutes from "./routes/category.route.js";
import badgeRoutes from "./routes/badge.route.js";

const app = express();

const allowedOrigins = [`${process.env.FRONTEND_BASE_URL}`];

const options = {
  origin: allowedOrigins,
  credentials: true

};

app.use(bodyParser.urlencoded({extended:true, limit:'4mb'})); 
app.use(express.json({limit:'4mb'}));
app.use(cors(options));
app.use(cookieParser());

app.use((error, req ,res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
  
    console.log("gets here ", error);
  
    res.status(status).json({message: message})
  
});

app.use(authRoutes);
app.use('/badge', badgeRoutes);
app.use('/task', taskRoutes);
app.use('/category', categoryRoutes);
app.use('/project', projectRoutes);
  

mongoose
// .connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
.connect(`${process.env.MONGO_URL}`)
.then(result => {

    app.listen(process.env.PORT || 3001);
    console.log(`Connected on port ${process.env.PORT || 3001}`)
})
    .catch(err => {
    console.log("Connection Error: ",err);
});

export const conn = mongoose.connection;





