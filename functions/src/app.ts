import express from "express";
import cors from 'cors';
import { userRoute } from "./routes/user.route";
import { authenticateUser } from "./middlewares/auth.middleware";

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/", authenticateUser,userRoute);

export default app;
