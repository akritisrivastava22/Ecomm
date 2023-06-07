import mongoose from "mongoose";
import { Schema } from "mongoose";
import AuthRoles from "./utils/authRoles.js";
import bcrypt from "bcrypt.js";
import JWT from "jsonwebtoken";
import config from "../config/index.js";

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
    },
//Generating tokens
    getJWTtoken: function(){
        //documentation
        //_id is an unique id which is by default created by mongo db just lik eprimary key in sql. It will be used in frontend for user mapping

        JWT.sign({_id: this._id}, config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRY
        })
    },

    //generate forgot password token
    generateforgotpasswordtoken: function(){
        const forgotToken = crypto.randomBytes(20).toString("hex")

    //this is to encrypt the token we got from above, can learn as it is
        this.forgotPasswordToken =crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex")

    //this is to set the expiry of the generated token
        this.forgotPasswordExpiry = Date.now() + 20*60*1000
        return forgotToken
    }
}

export default mongoose.model("User", userSchema);