import { Router } from "express";
import Auth from "./Middleware/auth.js"
import * as ad from "./RequestHandler/admin.requesthandler.js"
import * as us from "./RequestHandler/user.requesthandler.js"
import * as address from "./RequestHandler/address.requesthandler.js"
import * as product from "./RequestHandler/product.requesthandler.js"
import * as cart from "./RequestHandler/cart.requesthandler.js"
import * as order from "./RequestHandler/order.requesthandler.js"
import * as razorpay from "./RequestHandler/razorpay.requesthandler.js"


const router=Router()

//admin 
router.route("/addadmin").post(ad.addAdmin);
router.route("/loginadmin").post(ad.loginAdmin);
router.route("/adminforgetpassword").post(ad.adminForgetPassword);
router.route("/updatepassword").put(ad.updatePassword);
router.route("/allproducts").get(ad.allProducts);
router.route("/allusers").get(ad.allUser);
router.route("/blockproduct").post(ad.blockProduct);
router.route("/blockuser").post(ad.blockUser);


//user
router.route("/adduser").post(us.addUser);
router.route("/login").post(us.loginUser);
router.route("/home").get(Auth,us.Home);
router.route("/profile/:id").get(us.profileUser);
router.route("/updateuser/:id").put(us.updateUser);
router.route("/forgetpassword").post(us.forgetPassword);
router.route("/resetpassword").put(us.resetPassword);

//address
router.route("/addaddress").post(address.addAddress);
router.route("/getaddress/:id").get(address.getAddress);
router.route("/deleteaddress/:id").delete(address.deleteAddress);

//product
router.route("/addproduct").post(product.addProduct);
router.route("/allproducts").post(product.allProducts);
router.route("/getsellerproducts/:id").get(product.getSellerProducts);
router.route("/getoneproduct/:id").get(product.getoneProduct);
router.route("/updateproduct/:id").put(product.updateProduct);
router.route("/deleteproduct/:id").delete(product.deleteProduct);
router.route("/search").post(product.searchData);


//cart
router.route("/addcart").post(cart.addCart);
router.route("/showcart").post(cart.showCart);
router.route("/deletecart/:id").delete(cart.deleteCart);
router.route("/removeallfromcart").delete(cart.removeAllfromcart);

//order
router.route("/sendorder").post(order.sendOrder);
router.route("/getorders").post(order.getOrder);

//razorpay
router.route("/createRazorpayOrder").post(razorpay.createRazorpayOrder);
router.route("/verifyPayment").post(razorpay.verifyPayment);


export default router