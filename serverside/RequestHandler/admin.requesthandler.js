import adminSchema from "../Models/admin.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "bc1e5371d6dc68",
      pass: "2fc0de0595f9e6",
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

export  async function forgetPassword(req, res) {
    try {
        const info = await transporter.sendMail({
            from: 'najexo9138@owlny.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<button><a href='http://localhost:5173/resetpassword'>Reset Password</a></button>", // html body
          });
        
          console.log("Message sent: %s", info.messageId);
         
    } catch (error) {
        console.log(error);
        
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
        
    }
}
