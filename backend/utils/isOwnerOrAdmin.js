import Product from "../models/products.js";

export const isOwnerOrAdmin = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user is the owner or an admin
    if (product.createdBy.toString() === userId || userRole === "admin") {
      req.product = product;
      return next();
    }

    return res.status(403).json({ success: false, message: "Not authorized to perform this action" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};