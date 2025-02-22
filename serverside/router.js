import { Router } from "express";
import Auth from "./Middleware/auth.js"
import * as ad from "./RequestHandler/admin.requesthandler.js"
import * as us from "./RequestHandler/user.requesthandler.js"
import * as address from "./RequestHandler/address.requesthandler.js"
import * as product from "./RequestHandler/product.requesthandler.js"


const router=Router()

//admin 
router.route("/addadmin").post(ad.addAdmin);
router.route("/loginadmin").post(ad.loginAdmin);
router.route("/forgetpassword").post(ad.forgetPassword);
router.route("/updatepassword").put(ad.updatePassword);

//user
router.route("/adduser").post(us.addUser);
router.route("/login").post(us.loginUser);
router.route("/home").get(Auth,us.Home);
router.route("/profile/:id").get(us.profileUser);
router.route("/updateuser/:id").put(us.updateUser);

//address
router.route("/addaddress").post(address.addAddress);
router.route("/getaddress/:id").get(address.getAddress);
router.route("/deleteaddress/:id").delete(address.deleteAddress);

//product
router.route("/addproduct").post(product.addProduct);
router.route("/getproducts").get(product.getProducts);
export default router