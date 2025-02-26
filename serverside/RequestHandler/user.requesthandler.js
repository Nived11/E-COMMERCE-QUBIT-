import userSchema from "../Models/user.model.js"
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const {sign}=pkg



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

export async function loginUser(req,res) {
    try {
        const {email,password}=req.body;
    if(!(email&&password))
        return res.status(404).send({msg:"Fields are empty"});
    const user=await userSchema.findOne({email})
    if(user==null)
        return res.status(404).send({msg:"email is not valid"});
    const success=await bcrypt.compare(password,user.password)
    console.log(success);
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
        res.status(200).send({_id:_id,fname:user.fname,lname:user.lname,email:user.email,phone:user.phone,accountType:user.accountType})  
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