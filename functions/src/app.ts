import express from "express";
import cors from "cors";
import { userRoute } from "./routes/user.route";
import { authenticateUser } from "./middlewares/auth.middleware";
import { expenseRoute } from "./routes/expense.route";

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/", authenticateUser, userRoute);
app.use("/", authenticateUser, expenseRoute);

export default app;
