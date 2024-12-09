import express from "express";
import { userRoute } from "./routes/user.route";
import { authenticateUser } from "./middlewares/auth.middleware";

const app = express();
app.use(express.json());




app.use("/", authenticateUser,userRoute);

export default app;
