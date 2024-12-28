import { NextFunction, Request, Response } from "express";
import { generateErrorResponse } from "../utils/errorHandler";
import { MESSAGE } from "../constants/responseMessage.constants";
import { expensePath } from "../constants/firebasePath.constants";
import { readDocument } from "../utils/firebaseUtils";

const expenseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spaceId, expenseId } = req.params;
    // check data
    if (!spaceId || !expenseId) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    // get expense data
    const path = expensePath(spaceId, expenseId);
    const expense = await readDocument(path);

    // check eexpense exist
    if (!expense) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.EXPENSE_NOT_FOUND }));
      return;
    }

    req.body.expense = expense;

    next();
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};

export { expenseMiddleware };
