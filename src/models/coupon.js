import mongoose from "mongoose";
import { Schema } from "mongoose";

const couponSchema = new Schema ({

    

}, {timestamps:true})

export default mongoose.model("Coupon", couponSchema);