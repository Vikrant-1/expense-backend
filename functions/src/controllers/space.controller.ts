import { Request, Response } from "express";
import { generateErrorResponse } from "../utils/errorHandler";
import { MESSAGE } from "../constants/responseMessage.constants";
import {
  deleteDocument,
  getSpaceId,
  updateDocument,
  writeDocument,
} from "../utils/firebaseUtils";
import { SpaceType } from "../types/space.types";
import { spacePath, userPath } from "../constants/firebasePath.constants";
import { Firestore } from "firebase-admin/firestore";
import { firestore } from "firebase-admin";

const createSpaceController = async (req: Request, res: Response) => {
  try {
    const { name, spaceType, avatar, userId } = req.body;

    if (!name || !spaceType || !avatar) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    const spaceId = getSpaceId();
    // create data
    const spaceData = {
      id: spaceId,
      name: name,
      spaceType: spaceType as SpaceType,
      avatar: avatar || null,
      createdBy: getCreatedBy(userId),
    };
    // create space
    await writeDocument(spacePath(spaceId), spaceData);

    // update in user
    const userSpace = {
      id: spaceId,
      name: name,
      role: "admin",
    };
    await updateDocument(userPath(userId), {
      spaces: firestore.FieldValue.arrayUnion(userSpace),
    });

    res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.SPACE_CREATED,
        data: {
          userSpace: userSpace,
          space: spaceData,
        },
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.SPACE_CREATION_FAILED }));
  }
};

const updateSpaceController = async (req: Request, res: Response) => {
  try {
    const { name, spaceType, avatar } = req.body;
    const { spaceId, userId } = req.params;

    if (!name && !spaceType && !avatar) {
      res
        .status(404)
        .json(generateErrorResponse({ message: MESSAGE.MISSING_DATA }));
      return;
    }

    // create space
    await updateDocument(spacePath(spaceId), {
      ...req.body,
    });

    // update in user
    const userSpace = {
      id: spaceId,
      name: name,
      role: "admin",
    };
    await updateDocument(userPath(userId), {
      spaces: firestore.FieldValue.arrayUnion(userSpace),
    });

    res.status(201).json(
      generateSuccessResponse({
        message: MESSAGE.SPACE_UPDATED,
        data: {
          userSpace: userSpace,
        },
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({ message: MESSAGE.SPACE_CREATION_FAILED }));
  }
};

const deleteSpaceController = async (req: Request, res: Response) => {
  try {
    const { userId,spaceId} = req.params;
    
    await deleteDocument(spacePath(spaceId));
    await updateDocument(userPath(userId),{spaces:firestore.FieldValue.arrayRemove()});
  } catch (error) {
    res
    .status(500)
    .json(generateErrorResponse({ message: MESSAGE.SPACE_CREATION_FAILED }));
    
  }
};

const getSpaceController = async (req: Request, res: Response) => {};

export {
  createSpaceController,
  updateSpaceController,
  deleteSpaceController,
  getSpaceController,
};
