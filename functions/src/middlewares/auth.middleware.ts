import {Response, NextFunction, Request} from "express";
import {auth} from "firebase-admin";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({message: "Authorization token missing or malformed"});
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await auth().verifyIdToken(token);

    if (!decodedToken || !decodedToken.uid) {
      res.status(401).json({message: "Invalid or expired token"});
      return;
    }

    req.body.userId = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Token validation error:", error as typeof Error);
    res.status(401).json({message: "Invalid or expired token"});
  }
};

export {authenticateUser};
