import { NextFunction, Request, Response } from "express";
import { generateErrorResponse } from "../utils/errorHandler";
import { MESSAGE } from "../constants/responseMessage.constants";
import { spacePath } from "../constants/firebasePath.constants";
import { docExists } from "../utils/firebaseUtils";

const spaceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    const path = spacePath(spaceId);

    const isSpace = await docExists(path);

    if (!isSpace) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.SPACE_NOT_FOUND }));
      return;
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.INTERNAL_SERVER_ERROR }));
  }
};

export { spaceMiddleware };
