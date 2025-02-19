import addressSchema from '../Models/address.model.js';



export async function addAddress(req,res){
    const {userId, name,phone,housename,area,landmark,city,state,pincode}=req.body
    console.log( userId,name,phone,housename,area,landmark,city,state,pincode);
    if(!(userId,name&&phone&&housename&&area&&city&&state&&pincode))
        return(res.status(404).send({msg:"Fields are empty"}));
    await addressSchema.create({userId,name,phone,housename,area,landmark,city,state,pincode}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((error)=>{
        res.status(500).send({error})
    }) 
}

export async function getAddress(req,res){
   try {
           const { id } = req.params;
           console.log(id);
           const address = await addressSchema.findById(id);
           if (!address) {
               return res.status(404).send({ msg: "Address not found" });
           }
           return res.status(200).send({ 
                userId: address.userId,
                name: address.name,
                phone: address.phone,
                housename: address.housename,
                area: address.area,
                landmark: address.landmark,
                city: address.city,
                state: address.state,
                pincode: address.pincode
           });
       } catch (error) {
           return res.status(500).send({ error});
       }
}