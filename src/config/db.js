import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB(){
    try {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Mongo conectado");
    } catch (err) {
    console.error("Error conectando Mongo:", err);
    throw err;
    }
}
