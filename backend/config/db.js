import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const mongo_url = `${process.env.MONGO_URL}`

const connectDb = async function () {
    try{
        await mongoose.connect(mongo_url)
        console.log(`mongo connected :)`)
    }
    catch(error){
        console.error(error)
    }
}

export default connectDb