import { Request, Response } from "express";
import { generateErrorResponse } from "../utils/errorHandler";
import {
  getSpaceId,
  readDocument,
  updateDocument,
  writeDocument,
} from "../utils/firebaseUtils";
import { spacePath, userPath } from "../constants/firebasePath.constants";
import { MESSAGE } from "../constants/responseMessage.constants";
import { auth, firestore } from "firebase-admin";
import { SpaceType } from "../types/space.types";
import { DEFAULT_SPACE_NAME } from "../constants/spaces.constants";

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
    res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.USER_CREATED,
        data: {
          user: data,
        },
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.SIGNIN_FAILED }));
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await readDocument(userPath(id));

    if (!user || !user?.id) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.USER_NOT_FOUND }));
      return;
    }

    res.status(200).json(
      generateSuccessResponse({
        message: MESSAGE.USER_LOGGED_IN,
        data: {
          user: user,
        },
      })
    );
  } catch (error) {
    res
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
    const { userId, spaceType } = req.body;

    // check for userId and spaceType
    if (
      !userId ||
      ![SpaceType.BUSINESS, SpaceType.PERSONAL].includes(spaceType)
    ) {
      res
        .status(400)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    const spaceId = getSpaceId();
    const spaceData = {
      id: spaceId,
      spaceType: spaceType,
      name: DEFAULT_SPACE_NAME[spaceType as SpaceType],
      createdBy: getCreatedBy(userId),
    };
    await writeDocument(spacePath(spaceId), spaceData);
    await updateDocument(userPath(userId), {
      spaceType,
      spaces: firestore.FieldValue.arrayUnion({
        id: spaceId,
        name: spaceData.name,
        role: "admin", // we will handle roles later
      }),
    });

    res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.SPACE_CREATED,
        data: {
          space: spaceData,
        },
      })
    );
  } catch (error) {
    console.error("Error in onboarding:", error);
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.ONBOARDING_FAILED }));
  }
};

export {
  createUserController,
  loginUserController,
  updateUserController,
  deleteUserController,
  onBoardingDetailController,
};
