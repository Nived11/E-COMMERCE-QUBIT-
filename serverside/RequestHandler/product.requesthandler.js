import productSchema from "../Models/product.model.js";


export async function addProduct(req, res) {
    try {
        const { userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages } = req.body;
        console.log(userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications);
        if (!(productname && category && Brand && modelno && price && quantity && warranty && description && specifications&&productimages)) {
            return res.status(404).send({ msg: "Fields are empty" });
        }
        await productSchema.create({ userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages });
        res.status(201).send({ msg: "Product added successfully" });
    } catch (error) {
        res.status(500).send({ error });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await productSchema.find();
        if (!products || products.length === 0) {
            return res.status(404).send({ msg: "No products found" });
        }
        return res.status(200).send(products);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}