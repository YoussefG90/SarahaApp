import mongoose from 'mongoose'

const connectDB = async () => {
   try {
    const uri = process.env.URI
    const result = await mongoose.connect(uri)
    console.log("Connect To DB ✔");   
   } catch (error) {
    console.log("Fail To Connect DB ");  
   }

}

export default connectDB