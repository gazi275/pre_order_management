import express from "express";
import { PreorderRoutes } from "../modules/Preorder/preorder.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/preorders",
    route: PreorderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;