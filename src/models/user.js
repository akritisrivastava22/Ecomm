import mongoose from "mongoose";
import { Schema } from "mongoose";
import AuthRoles from "./utils/authRoles.js";
import bcrypt from "bcrypt.js";

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

//Encrypt password using Mongoose hooks
//you cant use callback in hooks thats why we use this keyword
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();

    
})
//instead of decrypting and comparing the pass, we encrypt the entered password as well to compare and match
userSchema.methods= {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    }
}

export default mongoose.model("User", userSchema);