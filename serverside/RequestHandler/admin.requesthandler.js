import adminSchema from "../Models/admin.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import productSchema from "../Models/product.model.js";
import userSchema from "../Models/user.model.js";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "qubit143@gmail.com",
      pass: "tggljdkbnesgrsqs",
    },
   
  });
export async function addAdmin(req,res){
    const {email,password}=req.body

    console.log(email,password);
    if(!(email&&password))
        return(res.status(404).send({msg:"Fields are empty"}));
    const data=await adminSchema.findOne({email})
    if(data)
        return(res.status(404).send({msg:"Email already exist try another mail"}));
    const hpassword=await bcrypt.hash(password,10)
    console.log(hpassword);

    await adminSchema.create({email,password:hpassword}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((error)=>{
       res.status(500).send({error})
        
    }) 
}

export async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(404).send({ msg: "Fields are empty" });
        }
        const admin = await adminSchema.findOne({ email });
        if (admin==null) {
            return res.status(404).send({ msg: "Email is not valid" });
        }
        const success = await bcrypt.compare(password, admin.password);
        if (!success) {
            return res.status(401).send({ msg: "Invalid password" });
        }
        const token = jwt.sign({ ADMINID: admin._id }, process.env.JWT_KEY, { expiresIn: "1h" });
        res.status(200).send({ msg: "Successfully logged in", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ msg: "Internal server error", error });
    }
}

export  async function adminForgetPassword(req, res) {
    try {

        const {email}=req.body
        console.log(email);
        
        const info = await transporter.sendMail({  
            from: 'qubit143@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "Hello world?", // plain text body
            html: "<button><a href='http://localhost:5173/adminresetpassword'>Reset Password</a></button>", // html body
          });
        res.status(200).send({msg:"email sent successfully"});
         
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"email not sent"});
    }
}

export async function updatePassword(req, res) {
    try {
        const {password,cpassword}=req.body
        if(!(password&&cpassword))
            return(res.status(404).send({msg:"Fields are empty"}));
        if(password!==cpassword)
            return(res.status(404).send({msg:"password not match"}));
        const hpassword=await bcrypt.hash(password,10)
        await adminSchema.findOneAndUpdate({email:"admin@123"},{password:hpassword}).then(()=>{
            res.status(201).send({msg:"successfully updated"})
        }).catch((error)=>{
           res.status(500).send({error})
            
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"Internal server error",error});
    }
}


export async function allProducts(req, res) {
    try {
        const product = await productSchema.find().lean();
        if (!product || product.length === 0) {
            return res.status(404).send({ msg: "No products found" });
        }
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error });
    }
}


export async function blockProduct(req, res) {
    try {
      const {_id}=req.body
      console.log(_id);
      const product=await productSchema.findByIdAndUpdate(_id ,[{$set:{block:{$not:"$block"}}}],{new:true});
      console.log(product);
      return res.status(200).send({msg:"successfully blocked.."});

    } catch (error) {
        res.status(500).send({ error });
    }
}


export async function allUser(req, res) {
    try {
        const user = await userSchema.find();
        if (!user || user.length === 0) {
            return res.status(404).send({ msg: "No user found" });
        }
        return res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error });
    }
}
export async function blockUser(req,res){
    try {
        const {_id}=req.body
        console.log(_id);
        const user=await userSchema.findByIdAndUpdate(_id ,[{$set:{block:{$not:"$block"}}}],{new:true});
        console.log(user);
        return res.status(200).send({msg:"successfully blocked.."});
        
    } catch (error) {
        res.status(500).send({error})
    }
}
