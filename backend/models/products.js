import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            minlength: 3 
        },
        description: {
            type: String, 
            required: true, 
            minlength: 10, 
            maxlength: 50 
        },
        price: { 
            type: Number, 
            required: true 
        },
        category: { 
            type: String, 
            required: true, 
            lowercase: true 
        },
        image: { 
            type: String, 
            required: true,
            set: (value) => `/public/product/${value}` 
        },
        productId: {
            type: String,
            unique: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.Mixed,
            ref: "User",
            required: true
          },   
    },
    { timestamps: true }
);



const Product = mongoose.model('Product', productSchema);
export default Product;