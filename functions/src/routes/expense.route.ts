import express from "express";
import { createExpenseController, deleteExpenseController, getExpenseController, updateExpenseController } from "../controllers/expense.controller";
import { spaceMiddleware } from "../middlewares/space.middleware";
import { expenseMiddleware } from "../middlewares/expense.middleware";
const expenseRoute = express.Router();

expenseRoute.post("/v1/api/space/:spaceId/expense",spaceMiddleware,createExpenseController);
expenseRoute.put("/v1/api/space/:spaceId/expense/:expenseId",expenseMiddleware,updateExpenseController);
expenseRoute.delete("/v1/api/space/:spaceId/expense/:expenseId",expenseMiddleware,deleteExpenseController);
expenseRoute.get("/v1/api/space/:spaceId/expense/:expenseId",expenseMiddleware,getExpenseController);

export {expenseRoute};
