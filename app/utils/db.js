import mongoose from "mongoose"
let isConnected=false

export const connectionDB=async ()=>{
mongoose.connect.set('strictQuery',true)
if(isConnected){
    console.log("MongoDB is already have Connected")
}
try{
   await mongoose.connect(process.env.MONGODB_URI,{
    dbName:'lawtest',
    useNewUrlParser:true,
    useUnifiedTopology:true
   })
   isConnected=true
   console.log("MongoDB Connected")

}catch(error)
{
    console.log(error)
}}