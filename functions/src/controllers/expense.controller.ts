import { Request, Response } from "express";
import { ExpenseInterface } from "../types/expense.type";
import {
  deleteDocument,
  getExpenseId,
  writeDocument,
} from "../utils/firebaseUtils";
import { expensePath } from "../constants/firebasePath.constants";
import { generateSuccessResponse } from "../utils/successHandler";
import { MESSAGE } from "../constants/responseMessage.constants";
import { generateErrorResponse } from "../utils/errorHandler";
import { getCreatedBy, getUpdatedBy } from "../utils/comman";

// TODO -> tracking of functions

const createExpenseController = async (req: Request, res: Response) => {
  const { data, userId } = req.body;
  const { spaceId } = req.params;
  try {
    // craete expense Id
    const expenseId = getExpenseId();

    // create expense data
    const expense: ExpenseInterface = {
      id: expenseId,
      name: data.name,
      amount: data.amount,
      currencyCode: data.currencyCode,
      description: data.description,
      categoryId: data.categoryId,
      expenseDate: data.expenseDate,
      createdBy: getCreatedBy(userId, true),
    };

    // write expense data
    const path = expensePath(spaceId, expenseId);
    await writeDocument(path, expense);

    // send success response
    res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.EXPENSE_CREATED,
        data: expense,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};
const updateExpenseController = async (req: Request, res: Response) => {
  try {
    const { data, userId, expense } = req.body;
    const { expenseId, spaceId } = req.params;

    // check data
    if (!data || !expenseId || !spaceId) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    //merge expense data
    const path = expensePath(spaceId, expenseId);

    const updatedExpense = {
      ...expense,
      ...data,
      updatedBy: getUpdatedBy(userId, true),
    };
    // write expense data
    await writeDocument(path, updatedExpense);

    // send success response
    res.status(200).json(
      generateSuccessResponse({
        message: MESSAGE.EXPENSE_UPDATED,
        data: updatedExpense,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};
const deleteExpenseController = async (req: Request, res: Response) => {
  try {
    const { expenseId, spaceId } = req.params;

    // delete expense data

    const path = expensePath(spaceId, expenseId);

    await deleteDocument(path);

    // send success response
    res.status(200).json(
      generateSuccessResponse({
        message: MESSAGE.EXPENSE_DELETED,
        data: null,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};
const getExpenseController = async (req: Request, res: Response) => {
  try {
    const { expense } = req.body;
    res.status(200).json(
      generateSuccessResponse({
        message: MESSAGE.EXPENSE_FETCHED,
        data: expense,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};

export {
  createExpenseController,
  updateExpenseController,
  deleteExpenseController,
  getExpenseController,
};
