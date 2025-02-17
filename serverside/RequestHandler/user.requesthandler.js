import userSchema from "../Models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export async function addUser(req,res){
    const {fname,lname,email,phone,password,cpassword,accountType}=req.body

    console.log(fname,lname,email,phone,password,cpassword,accountType);
    if(!(fname&&lname&&email&&phone&&password&&cpassword&&accountType))
        return(res.status(404).send({msg:"Fields are empty"}));
    if(password!==cpassword)
        return(res.status(404).send({msg:"password not match"}));
    const data=await userSchema.findOne({email})
    if(data)
        return(res.status(404).send({msg:"Email already exist try another mail"}));
    const hpassword=await bcrypt.hash(password,10)
    console.log(hpassword);

    await userSchema.create({fname,lname,email,phone,password:hpassword,accountType}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((error)=>{
       res.status(500).send({error})
        
    }) 
}

export async function loginUser(req,res){
    const {email,password}=req.body

    console.log(email,password);
    if(!(email&&password))
        return(res.status(404).send({msg:"Fields are empty"}));
    const data=await userSchema.findOne({email})
    if(data==null)
        return(res.status(404).send({msg:"Email is not valid"}));
    const success=await bcrypt.compare(password,data.password);
    if(!success)
        return(res.status(401).send({msg:"Invalid password"}));
    const token=jwt.sign({USERID:data._id},process.env.JWT_KEY,{expiresIn:"1h"});
    res.status(200).send({msg:"Successfully logged in",token});
}



export async function getUser(req, res) {
    try {
        const { id } = req.params;

        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        return res.status(200).send({
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone,
            accountType: user.accountType
        });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
} 