import userSchema from "../Models/user.model.js"
import bcrypt from "bcrypt";


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