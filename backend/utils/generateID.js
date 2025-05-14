import User from "../models/User.js";
import Product from "../models/products.js";

// Generate a sequential order of  userId
export const generateId = async (role) => {
  let userId;
  if (role === "admin") {
    const lastAdmin = await User.findOne({ role: "admin" }).sort({
      userId: -1,
    });
    const lastAdminId = lastAdmin
      ? parseInt(lastAdmin.userId.replace("ADMIN", ""))
      : 0;
    return (userId = `ADMIN${String(lastAdminId + 1).padStart(2, "0")}`);
  } else {
    const lastUser = await User.findOne({ role: { $ne: "admin" } }).sort({
      userId: -1,
    });
    const lastUserId = lastUser
      ? parseInt(lastUser.userId.replace("USER", ""))
      : 0;
    return (userId = `USER${String(lastUserId + 1).padStart(3, "0")}`);
  }
};

export const generateProductId = async () => {
  const lastProduct = await Product.findOne().sort({ productId: -1 });
  const lastProductId = lastProduct
    ? parseInt(lastProduct.productId.replace("PROD", ""))
    : 0;
  return `PROD${String(lastProductId + 1).padStart(3, "0")}`;
};
