
import mongoose from "mongoose";
const Schema = mongoose.Schema;


const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    content:{
        type: String,
        required: true
    },
  
    badges:{
        type: [{type: Schema.Types.ObjectId, ref: 'Badge'}],
        default: [],
        required: true
    },
  
  
}, { timestamps: true })

export default mongoose.model('Task', TaskSchema);

export {

    TaskSchema
}

