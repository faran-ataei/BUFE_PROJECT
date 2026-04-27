import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
    },
    image: {
        type: String,
        required: [true, "Product image is required"],
    },
});

const Product = model("Product", productSchema);
export default Product;

// https://avatars.mds.yandex.net/i?id=c9c14756e12ff6ded6326d5f6b99d1cbdcb26b45-4033951-images-thumbs&n=13