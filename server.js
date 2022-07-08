
import 'dotenv/config';
// const signin = require('./controllers/signin');

import helmet from "helmet";

import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import compression from "compression";
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

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const allowedOrigins = [`${process.env.FRONTEND_BASE_URL}`];

const options = {
  origin: allowedOrigins,
  credentials: true

};

app.use(compression({ filter: shouldCompress }))
 
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}

app.use(bodyParser.urlencoded({extended:true, limit:'4mb'})); 
app.use(express.json({limit:'4mb'}));
app.use(cors(options));
app.use(cookieParser());

app.use((error, req ,res, next) => {

    const status = error.statusCode || 500;
    const message = error.message;

    const body = error?.body;
    
    res.status(status).json({message: message, ...body})
  
});

app.use(authRoutes);
app.use('/auth', authRoutes);
app.use('/badge', badgeRoutes);
app.use('/task', taskRoutes);
app.use('/category', categoryRoutes);
app.use('/project', projectRoutes);
  

mongoose
// .connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
.connect(`${process.env.MONGO_URL}`)
.then(result => {

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "PUT"]
        }
    });

    io.on('connection', socket => {
        console.log("client connected")

        
    })

    httpServer.listen(process.env.PORT || 3001);

    // Start socket io server
    // socket build on top of http server
    // const io = import('./socket.js').init(server);

})
    .catch(err => {
    console.log("Connection Error: ",err);
});


export const conn = mongoose.connection;





