import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    username:{
        required:true,
        type:String
    },
    score: { type: mongoose.Schema.Types.ObjectId, ref: "Score" }

},{timestamps:true})

const User = mongoose.Model('User',userSchema)

export default User