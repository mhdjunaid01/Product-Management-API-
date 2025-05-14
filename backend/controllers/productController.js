// controllers/productController.js
import Product from "../models/products.js";
import { generateProductId } from "../utils/generateID.js";

//create
export const createProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ success: false, message: "User ID is missing" });
        }

        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "All fields  are required" });
        }

        if ( price <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number" });
        }

        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category: category.toLowerCase(),
            image: imageFile.filename,
            createdBy: req.user.id,
            productId: await generateProductId()
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
  
export const getProducts = async (req, res) => {
    try {
      const {
        search,
        category,
        min,
        max,
        sort,
        page = 1,
        limit = 5
      } = req.query;
  
      const query = {};
  
      //Search by name or productId
      if (search) {
        const regex = new RegExp(search, "i"); // case-insensitive
        query.$or = [
          { name: regex },
          { productId: regex }
        ];
      }
  
      //Filter by category
      if (category) {
        query.category = category.toLowerCase();
      }
  
      //Filter by price range
      if (min || max) {
        query.price = {};
        if (min) query.price.$gte = Number(min);
        if (max) query.price.$lte = Number(max);
      }
  
      let mongooseQuery = Product.find(query, "name image price productId");
  
      //Sort
      if (sort) {
        mongooseQuery = mongooseQuery.sort(sort); // e.g., -price, createdAt, name
      }
  
      //Pagination
      const skip = (page - 1) * limit;
      mongooseQuery = mongooseQuery.skip(skip).limit(Number(limit));
  
      const [products, total] = await Promise.all([
        mongooseQuery,
        Product.countDocuments(query),
      ]);
  
      res.status(200).json({
        success: true,
        products,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: Number(page),
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
  
  

// get single product
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "name email description category");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

//update product
export const updateProduct = async (req, res) => {
    try {
        console.log("ddddd", req.user);
        const { name, description, price, category } = req.body;
        const image = req.file?.filename;

        const product = req.product;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image =image
        product.createdBy = req.user.id;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// delete 
export const deleteProduct = async (req, res) => {
    try {
        const product = req.product;

        await product.deleteOne();

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
