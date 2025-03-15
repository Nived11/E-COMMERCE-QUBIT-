import addressSchema from '../Models/address.model.js';


export async function addAddress(req,res){
    const {userId, name,phone,housename,area,landmark,city,state,pincode}=req.body
    console.log( userId,name,phone,housename,area,landmark,city,state,pincode);
    if(!(name&&phone&&housename&&area&&city&&state&&pincode))
        return(res.status(404).send({msg:"Fields are empty"}));
    await addressSchema.create({userId,name,phone,housename,area,landmark,city,state,pincode}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((error)=>{
        res.status(500).send({error})
    }) 
}

export async function getAddress(req, res) {
    try {
      const { id } = req.params;
      console.log("Fetching addresses for user:", id);
      const addresses = await addressSchema.find({ userId: id });
      if (!addresses || addresses.length === 0) {
        return res.status(404).send({ msg: "No addresses found for this user" });
      }
      return res.status(200).send(addresses);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error});
    }
  }
  
  export async function deleteAddress(req, res) {
    try {
      const { id } = req.params;
      const deletedAddress = await addressSchema.findByIdAndDelete(id);
      if (!deletedAddress) {
        return res.status(404).send({ msg: "Address not found" });
      }
      return res.status(200).send({ msg: "Address deleted... " });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  }