


import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Expires is in seconds

const TokenSchema = new mongoose.Schema({
 
    token: {
        type: String,
        
        required: true
    },
    expiresAt: { type: Date, expires: `${process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS}s`, default: Date.now }
    
},
{timestamps: true})

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds : process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS });

export default mongoose.model('Token', TokenSchema);

export { 
    TokenSchema
 }



