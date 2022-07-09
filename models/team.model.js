

import mongoose from "mongoose";
const Schema = mongoose.Schema;


const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    projects:{
        type: [{ type: Schema.Types.ObjectId, ref: 'project' }],
        default: [],
        required: true
        
    },
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: [],
        required: true

    }
  
})

export default mongoose.model('Team', TeamSchema);

export {

    TeamSchema
}



