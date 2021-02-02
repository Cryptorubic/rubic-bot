import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes/routes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
Routes(app);


const port = process.env.NODE_ENV === 'development' ? 8080 : 80;

app.listen(port, () => {
    console.log(`Server runs on ${port} port`);
});
