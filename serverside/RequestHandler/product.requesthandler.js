import productSchema from "../Models/product.model.js";
import userSchema from "../Models/user.model.js";  

export async function addProduct(req, res) {
    try {
        const { userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages,block=false } = req.body;
        console.log(userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications);
        if (!(productname && category && Brand && modelno && price && quantity && warranty && description && specifications&&productimages)) {
            return res.status(404).send({ msg: "Fields are empty" });
        }
        await productSchema.create({ userId, productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages,block });
        res.status(201).send({ msg: "Product added successfully" });
    } catch (error) {
        res.status(500).send({ error });
    }
}

export async function allProducts(req, res) {
    try {
      const {userId}=req.body;
      console.log("userr id geting",userId);
      if(!userId){
        return res.status(404).send({ msg: "userId not found" });
      }
      
      // First, get a list of blocked user IDs
      const blockedUsers = await userSchema.find({ block: true }).select('_id');
      const blockedUserIds = blockedUsers.map(user => user._id);
      
      // Find products excluding both the current user's products and any products from blocked users
      const products = await productSchema.find({
        $and: [
          { userId: { $ne: userId } },
          { userId: { $nin: blockedUserIds } },
          { block: false }  // Only include non-blocked products
        ]
      });
      
      if (!products || products.length === 0) {
        return res.status(404).send({ msg: "No products found" });
      }
      
      return res.status(200).send(products);
    } catch (error) {
      console.error(error);
        return res.status(500).send({ error });
    }
}

export async function getSellerProducts (req, res) {
    try {
      const { id } = req.params;
      console.log("Fetching addresses for user:", id);
      const products = await productSchema.find({ userId: id });
      if (!products || products.length === 0) {
        return res.status(404).send({ msg: "No products found" });
      }
      return res.status(200).send(products);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error});
    }
  }
  export async function getoneProduct(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      
      const product = await productSchema.findById(id);
      if (!product) {
        return res.status(404).send({ msg: "Product not found" });
      }
      
      // Check if the product's seller is blocked
      const seller = await userSchema.findById(product.userId);
      if (seller && seller.block) {
        return res.status(403).send({ msg: "This product is unavailable as the seller has been blocked" });
      }
      
      // Check if the product itself is blocked
      if (product.block) {
        return res.status(403).send({ msg: "This product is currently unavailable" });
      }
      
      return res.status(200).send(product);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  }

  export async function updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages } = req.body;
        console.log(id, productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages);
     
      const updatedProduct = await productSchema.findById(id);
      if (!updatedProduct) {
        return res.status(404).send({ msg: "Product not found" });
      }
    await productSchema.findByIdAndUpdate(id, { productname, category, Brand, modelno, price, quantity, warranty, description, specifications, productimages });
      res.status(200).send({ msg: "Product updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  }

  export async function deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await productSchema.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).send({ msg: "Product not found" });
      }
      res.status(200).send({ msg: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  }

    export async function searchData(req, res) {
      try {
        const { search, userId } = req.body;
        
        // Get a list of blocked user IDs
        const blockedUsers = await userSchema.find({ block: true }).select('_id');
        const blockedUserIds = blockedUsers.map(user => user._id);
        
        console.log("Search Query:", search);
        const products = await productSchema.find({
          productname: { $regex: search, $options: "i" },
          $and: [
            { userId: { $ne: userId } },
            { userId: { $nin: blockedUserIds } },
            { block: false }  // Only include non-blocked products
          ]
        });
    
        res.status(200).json({ msg: "Search results", products });
      } catch (error) {
        console.error("Error in searchData:", error);
        res.status(500).json({ msg: "Internal Server Error" }); 
      }
    }