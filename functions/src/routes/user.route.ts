import {Router} from "express";
import {createUserController, deleteUserController, loginUserController, onBoardingDetailController, updateUserController} from "../controllers/user.controller";

const userRoute = Router();

userRoute.post("/v1/api/user/signup", createUserController);
userRoute.post("/v1/api/user/login", loginUserController);
userRoute.put("/v1/api/user", updateUserController);
userRoute.delete("/v1/api/user", deleteUserController);
userRoute.post("/v1/api/onBoarding", onBoardingDetailController);


export {userRoute};
