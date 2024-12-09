import express from "express";
import {
  createSpaceController,
  deleteSpaceController,
  getSpaceController,
  updateSpaceController,
} from "../controllers/space.controller";

const spaceRoute = express.Router();

spaceRoute.post("/v1/api/space", createSpaceController);
spaceRoute.put("/v1/api/space/:spaceId", updateSpaceController);
spaceRoute.delete("/v1/api/space/:spaceId", deleteSpaceController);
spaceRoute.get("/v1/api/space/:spaceId", getSpaceController);
