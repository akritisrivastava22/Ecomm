import mongoose from "mongoose";
import { Schema } from "mongoose";

const collectionSchema = new Schema ({
    name : {
        type: String,
        required: ["true", "Please enter collection name"],
        // we don't need to check now if user is entering name or not, mongoose inbuilt feature checks
        trim: true,
        maxLength: [120, "Please enter small name"]
    }
},

{timestamps: true}
//setting it true will help to add 2 properties of Date ( createdAT & updatedAT)
);

export default mongoose.model("Collection", collectionSchema);
// in database this schema will be saved as collections