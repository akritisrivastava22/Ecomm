import mongoose from "mongoose";
import { Schema } from "mongoose";


const productSchema = new Schema ({
    name:{
        type:String,
        required: ["true", "please enter a name"],
        trim: true,
        maxLength: [50,"enter less than 50 characters"]
    },
    price:{
        type: Number,
        required: ["true", "please enter a name"],
        maxLength: [5,"max 5  characters"]
    },
    description: {
        type: String,
        required: ["true", "please enter a name"],
        
    },
    //We made an array [] and had a object in it {}
    photos: [{
        secure_url: {
            type:String,
            required:true
        }
    }],
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }

}, {timestamps:true})

export default mongoose.model("Product", productSchema);
