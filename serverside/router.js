import { Router } from "express";
import * as ad from "./RequestHandler/admin.requesthandler.js"
import * as us from "./RequestHandler/user.requesthandler.js"

// console.log(us.getUser);

const router=Router()

//admin 
router.route("/addadmin").post(ad.addAdmin);
router.route("/loginadmin").post(ad.loginAdmin);
router.route("/forgetpassword").post(ad.forgetPassword);
router.route("/updatepassword").put(ad.updatePassword);

//user
router.route("/adduser").post(us.addUser);
router.route("/login").post(us.loginUser);
router.route("/getuser/:id").get(us.getUser);

export default router