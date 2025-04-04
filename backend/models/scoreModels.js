import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    
    points:{
        type:Number,
        required:true,
        default:0
    },
    rebirths:{
        type:Number,
        required:true,
        default:0
    },
    upgrades: {
        type: Map, 
        of: Number,
        required: true,
        default: {},
      },


},{timestamps:true})
const Score = mongoose.Model('Score',scoreSchema)

export default Score