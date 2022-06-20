
import mongoose from "mongoose";
import { BadgeSchema } from "./badge.model.js";
import { CategorySchema } from "./category.model.js";

const Schema = mongoose.Schema;


const ProjectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    badges: {

        type: [BadgeSchema],
        default: [],
        required: true

    },
    category: {
        type:  [CategorySchema],
        default: [],
        required: false
    },
    users: {
        type:[{type: Schema.Types.ObjectId, ref: 'User'}],
        required: true
    }
  
})

export default mongoose.model('Project', ProjectSchema);

