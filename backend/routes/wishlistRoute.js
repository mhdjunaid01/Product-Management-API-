import express from "express";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,

} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(verifyToken, checkRole(["user"]));

router.post("/add/:productId", addToWishlist);
router.get("/", getWishlist);
router.delete("/remove/:productId", removeFromWishlist);

export default router;
