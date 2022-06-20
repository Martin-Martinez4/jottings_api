
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";

async function signup (req, res, next){
    
    try{
            
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
    
        const hashedPw = await bcrypt.hash(password, 12)
    
        const user = await new User({
            email: email,
            password: hashedPw,
            username: name
        })
        
        user.save();
        res.status(201).json({ message: 'User created!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating User";

        next(err);
        
    }



};


export default {

    signup
}
