import express from 'express';
import 'dotenv/config';
import connectDB from './config/mongo.config';
import morgan from 'morgan';
import userRoute from './routes/router';

const app = express();

app.use(morgan("dev"))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoute);





async function bootstarp() {
    await connectDB();
    app.listen(process.env.PORT!, () => {
        console.log('User-service running on port: ', process.env.PORT!);
    });
}

bootstarp();
