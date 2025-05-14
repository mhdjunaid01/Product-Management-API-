
import express from "express";
import {createProduct,deleteProduct,getProduct,getProducts,updateProduct,} from "../controllers/productController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import { isOwnerOrAdmin } from "../utils/isOwnerOrAdmin.js";
import upload from "../middleware/multer.js";
import { productSchema } from "../validators/productValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.post("/createProduct",verifyToken,checkRole(["user", "admin"]),upload.single("image"), validate(productSchema),createProduct);//create Product
router.get("/", getProducts);//get Products
router.get("/getProduct/:id", getProduct)//get single product;
router.put("/updateProduct/:id",verifyToken,checkRole(["user", "admin"]),isOwnerOrAdmin,upload.single("image"), updateProduct);//updateProduct
router.delete("/deleteProduct/:id",verifyToken,checkRole(["user", "admin"]),isOwnerOrAdmin,deleteProduct);//delete Product

export default router;

