import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.js';

dotenv.config();
const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('mongo connected');
        app.listen(process.env.PORT || 8000, () => console.log(`Server is running on port:${process.env.PORT || 8000}`));
    })
    .catch((error) => console.log('mongo connection error', error));

app.use('/', router());