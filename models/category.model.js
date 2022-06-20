

import mongoose from "mongoose";
import { TaskSchema } from "./task.model.js";

const Schema = mongoose.Schema;


const CategorySchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },
    tasks: {

        type: [TaskSchema],
        default: [],
        required: true,

    },
    badges: {

        type: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
        default: [],
        required: true

    },
  
   
  
}, {timestamps: true})

export default mongoose.model('Category', CategorySchema);

export { 
    CategorySchema
 }
