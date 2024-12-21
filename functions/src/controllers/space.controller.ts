import {Request, Response} from "express";
import {generateErrorResponse} from "../utils/errorHandler";
import {MESSAGE} from "../constants/responseMessage.constants";
import {
  deleteDocument,
  getSpaceId,
  updateDocument,
  writeDocument,
} from "../utils/firebaseUtils";
import {SpaceType} from "../types/space.types";
import {
  spacePath,
  userPath,
  userSpacePath,
} from "../constants/firebasePath.constants";
import {firestore} from "firebase-admin";
import {getCreatedBy} from "../utils/comman";
import {generateSuccessResponse} from "../utils/successHandler";

const createSpaceController = async (req: Request, res: Response) => {
  try {
    const {
      data: {name = "", spaceType = SpaceType.PERSONAL, avatar = ""} = {},
      userId,
    } = req.body;

    if (!name || !spaceType || !avatar) {
      res
        .status(404)
        .json(generateErrorResponse({message: MESSAGE.MISSING_DATA}));
      return;
    }

    const spaceId = getSpaceId();
    // create data
    const spaceData = {
      id: spaceId,
      name: name,
      spaceType: spaceType as SpaceType,
      avatar: avatar || null,
      role: "admin",
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
    await writeDocument(userSpacePath(userId, spaceId), userSpace);

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
      .json(generateErrorResponse({message: MESSAGE.SPACE_CREATION_FAILED}));
  }
};

const updateSpaceController = async (req: Request, res: Response) => {
  try {
    const {
      data: {name = "", spaceType = SpaceType.PERSONAL, avatar = ""} = {},
      userId,
    } = req.body;
    const {spaceId} = req.params;

    if (!name && !spaceType && !avatar) {
      res
        .status(404)
        .json(generateErrorResponse({message: MESSAGE.MISSING_DATA}));
      return;
    }

    // update space
    await updateDocument(spacePath(spaceId), {
      ...req.body.data,
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
      .json(generateErrorResponse({message: MESSAGE.SPACE_CREATION_FAILED}));
  }
};

const deleteSpaceController = async (req: Request, res: Response) => {
  try {
    const {userId, spaceId} = req.params;

    await deleteDocument(spacePath(spaceId));
    await deleteDocument(userSpacePath(userId, spaceId));
  } catch (error) {
    res
      .status(500)
      .json(generateErrorResponse({message: MESSAGE.SPACE_CREATION_FAILED}));
  }
};

const getSpaceController = async (req: Request, res: Response) => {
  try {
    res.status(200).json(generateSuccessResponse({message: "", data: ""}));
  } catch (error) {
    res
      .status(200)
      .json(generateErrorResponse({message: MESSAGE.SIGNIN_FAILED}));
  }
};

export {
  createSpaceController,
  updateSpaceController,
  deleteSpaceController,
  getSpaceController,
};
