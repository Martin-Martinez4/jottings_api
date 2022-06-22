
import mongoose from "mongoose";
const Schema = mongoose.Schema;


const BadgeSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },
    color: {

        type: String,
        default: "blue",
        required: false

    },
   
    
  
})


export default mongoose.model('Badge', BadgeSchema);
export {
    BadgeSchema
};
