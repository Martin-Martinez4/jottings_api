
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
    taskBadgesRelation: {

        type: [{Task: {type: Schema.Types.ObjectId, ref: 'Project.category.tasks'}, Badges: {type: Schema.Types.ObjectId, ref: 'Project.badges'}}],
        default: [],
        required: false

    },
    category: {
        type:  [CategorySchema],
        default: [],
        required: true
    },
    users: {
        type:[{type: Schema.Types.ObjectId, ref: 'User'}],
        required: true
    },
    length: {
        type: Number,
        required: true,
        default: 0
    }
  
})


export default mongoose.model('Project', ProjectSchema);

