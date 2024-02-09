import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.js';

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);


const MONGO_URL = 'mongodb+srv://amandeepmalik:amandeepmalik@expressjsauth.aaqse1v.mongodb.net/authData?retryWrites=true&w=majority';
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('connected', () => {
    console.log('mongo connected');
    server.listen(8000, () => console.log('Server is running on port:8000'));
});
mongoose.connection.on('error', (error) => console.log('mongo connection error', error));

app.use('/', router());