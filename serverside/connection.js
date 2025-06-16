import mongoose from "mongoose";

export default async function connection() {
    const db=await mongoose.connect("mongodb+srv://ecommerce:ecom123@qubit.0jqivma.mongodb.net/E-COMMERCE");
    console.log("database created");
    return db
}