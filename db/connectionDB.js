import mongoose, { connect } from "mongoose";
  const connectionDB = async()=>{
return await mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log("databaser connection error",err);
})
 }

export default connectionDB;