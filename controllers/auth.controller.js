
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
        
        user.save().then(result => {

            res.status(201).json({ message: 'User created!'});
            
        }).catch(err => {
            err.statusCode = err.statusCode | 500;

            err.message = err.message | "Error Creating User";
    
            next(err);
            res.status(400).json({ message: "Error Creating User"});
        });

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating User";

        next(err);
        
    }
};

// signIn
async function signin(req, res, next){

    try{
            
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({"email": `${email}`})

        const { username, projects, permissions } = user
    
        bcrypt.compare(password, user.password, (err, result) => {

            if(result === true){

                res.status(201).json({ message: 'User Signed in!', user: { email: email, username: username, projects: projects, permissions: permissions, isAuth: true }});
                return

            }
            else if(result === false){

                const err = new Error({message: "Error Signing in User", statusCode: 400})

                err.statusCode = err.statusCode | 500;

                err.message =  err.message | "Error Signing in User";

                next(err);



            }
            else{

                err.statusCode = err.statusCode | 500;

                err.message =  err.message | "Error Signing in User";

                next(err);

            }



        })
    
       
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Signing in User";

        next(err);
        
    }

}


export default {

    signup,
    signin
}
