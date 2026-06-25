import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PreorderController } from "./preorder.controller";
import { PreorderValidation } from "./preorder.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(PreorderValidation.create),
  PreorderController.createPreorder
);

router.get("/", PreorderController.getAllPreorders);

router.get("/:id", PreorderController.getSinglePreorder);

router.patch(
  "/:id",
  validateRequest(PreorderValidation.update),
  PreorderController.updatePreorder
);

router.patch("/:id/status", PreorderController.toggleStatus);

router.delete("/:id", PreorderController.deletePreorder);

export const PreorderRoutes = router;
