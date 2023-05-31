import mongoose from "mongoose";
import { Schema } from "mongoose";
import AuthRoles from "./utils/authRoles.js";
import bcrypt from "bcryptjs";

const userSchema = new Schema ({
    name:{
        type:String,
        required: ["true", "please enter a name"],
        maxLength: [50,"enter less than 50 characters"]
    },
    email:{
        type: String, 
        required:["true", "Email is required"]
    },
    password: {
        type:String,
        required:["true", "Password is required"],
        minLength: [8, "Password must be 8 characters"],
        select: false
    },
    role:{
        type: String,
        //it is picking value from utils/authroles
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
},

    
    {timestamps:true}
);

export default mongoose.model("User", userSchema);