import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "" },
    thumbnails: { type: [String], default: [] }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("Product", productSchema);
