import { Request, Response } from "express";
import { generateErrorResponse } from "../utils/errorHandler";
import { readDocument, writeDocument } from "../utils/firebaseUtils";
import { userPath } from "../constants/firebasePath.constants";
import { MESSAGE } from "../constants/responseMessage.constants";
import { auth } from "firebase-admin";

const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, avatar, isVerified, id } = req.body;

    // if user exist throw error
    const user = await readDocument(userPath(id));
    if (user && user.id) {
       res
        .status(400)
           .json(generateErrorResponse({ message: MESSAGE.USER_ALREADY_EXIST }));
        return;
    }

    // create user data
    const providerData = (await auth().getUser(id)).providerData;
    const data = {
      id: id,
      name: name,
      email: email,
      avatar: avatar,
      isVerified: isVerified,
      providerData: providerData,
    };

    // save data in firebase
    await writeDocument(userPath(id), data);

    // send response
    return res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.USER_CREATED,
        data: {
          user: data,
        },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.SIGNIN_FAILED }));
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await readDocument(userPath(id));

    if (!user || !user?.id) {
      return res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.USER_NOT_FOUND }));
    }

    return res.status(200).json(
      generateSuccessResponse({
        message: MESSAGE.USER_LOGGED_IN,
        data: {
          user: user,
        },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.LOGIN_FAILED }));
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res
      .status(200)
      .json(generateErrorResponse({ message: MESSAGE.SIGNIN_FAILED }));
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res
      .status(200)
      .json(generateErrorResponse({ message: MESSAGE.SIGNIN_FAILED }));
  }
};

const onBoardingDetailController = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}

export {
  createUserController,
  loginUserController,
  updateUserController,
  deleteUserController,
};
