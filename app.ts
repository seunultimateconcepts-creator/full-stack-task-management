import express, {Application} from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health",(_req,res)=>{
    res.status(200).json({ status: "OK", message: "Server is running"});
});

app.use('/auth', authRoutes);
app.use(errorHandler);

export default app;