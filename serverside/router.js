import { Router } from "express";
import * as rh from "./RequestHandler/user.requesthandler.js"
import * as ad from "./RequestHandler/admin.requesthandler.js"


const router=Router()

//admin 
router.route("/addadmin").post(ad.addAdmin);
router.route("/loginadmin").post(ad.loginAdmin);
router.route("/forgetpassword").post(ad.forgetPassword);
router.route("/updatepassword").put(ad.updatePassword);

//user
router.route("/adduser").post(rh.addUser);
router.route("/login").post(rh.loginUser);

export default router