import userSchema from "../Models/user.model.js"
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const {sign}=pkg
import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "qubit143@gmail.com",
      pass: "tggljdkbnesgrsqs",
    },
  });

export async function addUser(req,res){
    const {fname,lname,email,phone,password,cpassword,accountType,companyName,companyProof}=req.body

    console.log(fname,lname,email,phone,password,cpassword,accountType,companyName,companyProof);
    if(!(fname&&lname&&email&&phone&&password&&cpassword&&accountType))
        return(res.status(404).send({msg:"Fields are empty"}));
    if(password!==cpassword)
        return(res.status(404).send({msg:"password not match"}));
    const data=await userSchema.findOne({email})
    if(data)
        return(res.status(404).send({msg:"Email already exist try another mail"}));
    
    if(accountType === "seller" && !companyName)
        return(res.status(404).send({msg:"plase enter your company name"}));
    
    const hpassword=await bcrypt.hash(password,10)
    console.log(hpassword);

    const userData = {fname, lname, email, phone, password: hpassword, accountType};
    if(accountType === "seller") {
        userData.companyName = companyName;
        userData.companyProof = companyProof;
    }

    await userSchema.create(userData).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((error)=>{
       res.status(500).send({error})
    }) 
}


export async function loginUser(req,res) {
    try {
        const {email,password}=req.body;
    if(!(email&&password))
        return res.status(404).send({msg:"Fields are empty"});
    const user=await userSchema.findOne({email})
    if(user==null)
        return res.status(404).send({msg:"email is not valid"});
    if(user.block === true)
        return res.status(403).send({msg:"Your account has been blocked. Please contact admin for assistance."});
    const success=await bcrypt.compare(password,user.password)
    console.log(success);
    if (!success)
        return res.status(401).send({msg:"Invalid password"});
    const token=await sign({userID:user._id},process.env.JWT_KEY,
        {expiresIn:"24h"});
        console.log(user._id+ "user id");
        
    res.status(200).send({msg:"successfully loged in",token,userId:user._id})
        
    } catch (error) {
        res.status(400).send({error})
    }
}

export async function Home(req,res){
    try{
        console.log("end point");
        console.log(req.user);
        const _id=req.user.userID;
        console.log(_id);
        
        const user=await userSchema.findOne({_id});
        res.status(200).send({_id:_id,fname:user.fname,lname:user.lname,email:user.email,phone:user.phone,accountType:user.accountType,})  
    }catch(error){
        res.status(400).send({error})
    }
}

export async function profileUser(req, res) {
    try {
        const { id } = req.params;
        console.log(id);

        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        if (user.block === true) {
            return res.status(403).send({ msg: "Your account has been blocked. Please contact admin" });
        }
        return res.status(200).send({ 
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone,
            accountType: user.accountType

        });
    } catch (error) {
        return res.status(500).send({ error});
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { fname, lname, email, phone, accountType } = req.body;
        console.log(id, fname, lname, email, phone, accountType);

        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        await userSchema.findByIdAndUpdate(id, { fname, lname, email, phone, accountType });
        return res.status(200).send({ msg: "User updated successfully" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

export async function forgetPassword(req, res) {
    try {

        const {email}=req.body
        console.log(email);
        
        const info = await transporter.sendMail({  
            from: 'qubit143@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "Hello world?", // plain text body
            html: "<button><a href='http://localhost:5173/resetpassword'>Reset Password</a></button>", // html body
          });
        res.status(200).send({msg:"email sent successfully"});
         
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"email not sent"});
    }
}

export async function resetPassword (req,res){
    try {
            const {data,email}=req.body
            const {password,cpassword}=data
            console.log("backend",email);
            if(!(password&&cpassword))
                return(res.status(404).send({msg:"Fields are empty"}));
            if(password!==cpassword)
                return(res.status(404).send({msg:"password not match"}));
            const hpassword=await bcrypt.hash(password,10)
            await userSchema.findOneAndUpdate({email:email},{password:hpassword}).then(()=>{
                res.status(201).send({msg:"successfully updated"})
            }).catch((error)=>{
               res.status(500).send({error})
                
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({msg:"Internal server error",error});
        }
}