import Wishlist from "../models/Wishlist.js";
import Product from "../models/products.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;
    console.log("User ID:", userId);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user.userId,
        products: [product._id],
      });
      return res
        .status(201)
        .json({ message: "Wishlist created & product added", wishlist });
    }

    if (wishlist.products.includes(product._id))
      return res.status(400).json({ message: "Product already in wishlist" });

    if (wishlist.products.length >= 15)
      return res
        .status(400)
        .json({ message: "Maximum 15 products allowed in wishlist" });

    wishlist.products.push(product._id);
    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ userId }).populate("products");
    if (!wishlist)
      return res.status(404).json({ message: "No wishlist found" });

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
