import express, {Application} from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health",(req,res)=>{
    res.status(200).json({ status: "OK", message: "Server is running"});
});

export default app;