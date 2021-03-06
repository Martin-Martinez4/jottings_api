
import mongoose from "mongoose";
const Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    teams: {

        type: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
        default: [],
        required: true

    },
    projects: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
        default: [],
        required: true
    },
    permissions: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Permissions' }],
        default: [],
        required: true
    }
  
})

export default mongoose.model('User', UserSchema);