import "express-async-errors";
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// import { body, validationResult } from 'express-validator';
import * as dotenv from 'dotenv';
dotenv.config();

// routers
import jobsRouter from './routes/job.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from "path";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5117;

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// temp data
let jobs = [
  { id: nanoid(), company: 'apple', position: 'front-end' },
  { id: nanoid(), company: 'google', position: 'back-end' }
];

app.use(express.json());
// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static(path.resolve(__dirname, './client/dist')));

// COOKIE PARSER
app.use(cookieParser());

// SECURITY PACKAGES
app.use(helmet());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.send('Welcome My friend!');
})

// TEST
app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

// JOB ROUTER
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
// USER ROUTER
app.use('/api/v1/user', authenticateUser, userRouter);
// AUTH ROUTER
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
})

// ERROR NOT FOUND
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Not found' })
});

// ERROR HANDLER
app.use(errorHandlerMiddleware);

console.log('server is working');

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}...`);
  })
} catch (error) {
  console.log(error);
  process.exit(1);
}

// app.listen(PORT, () => {
//   console.log(`Server listening at PORT ${PORT}`);
// });

//* NEW! Node Fetch
// fetch('https://www.course-api.com/react-useReducer-cart-project').then(res => res.json()).then(data => console.log(data));

//* NEW! Global Async Await
// try {
//   const response = await fetch('https://www.course-api.com/react-useReducer-cart-project');
//   const cartData = await response.json();
//   console.log(cartData);
// } catch (error) {
//   console.log(error);
// }