
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../utils/createTokens.js';
import { createStoreSendTokens } from '../utils/createTokens.js';
import Token from '../models/refreshToken.model.js';

import User from "../models/user.model.js";

async function signup (req, res, next){
    
    try{
            
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
    
        const hashedPw = await bcrypt.hash(password, 12)
    
        const user = await new User({
            email: email,
            password: hashedPw,
            username: username
        })
        
        user.save().then(async result => {

            const {email, username, projects, permissions} = result

            const refreshAndAccessTokens =  await createStoreSendTokens(result._id.toString())

                const refreshTokenExiprationInMiliSeconds = process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000

                res.cookie('refresh_token', refreshAndAccessTokens.refresh_token, { httpOnly: true, sameSite: 'None', maxAge: refreshTokenExiprationInMiliSeconds, secure: true });

                res.status(201).json({ 
                    message: 'User created!', 
                    user: { 
                            email: email, 
                            username: username, 
                            projects: projects, 
                            permissions: permissions, 
                            access_token: refreshAndAccessTokens.access_token, 
                            isAuth: true 
                        }
                });

            
        }).catch(err => {
            err.statusCode = err.statusCode | 500;

            err.message = err.message | "Error Creating User";
    
            next(err);
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

        const user = await User.findOne({"email": `${email}`}).populate('projects', ["title", "description", "logo_url"]);

        const { _id, username, projects, permissions } = user
    
        bcrypt.compare(password, user.password, async (err, result) => {

            if(result === true){

                const refreshAndAccessTokens =  await createStoreSendTokens(_id.toString())

                const refreshTokenExiprationInMiliSeconds = process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000

                res.cookie('refresh_token', refreshAndAccessTokens.refresh_token, { httpOnly: true, sameSite: 'None', maxAge: refreshTokenExiprationInMiliSeconds, secure: true });

                res.status(201).json({ 
                    message: 'User Signed in!', 
                    user: { 
                            email: email, 
                            username: username, 
                            projects: projects, 
                            permissions: permissions, 
                            access_token: refreshAndAccessTokens.access_token, 
                            isAuth: true 
                        }
                });

                

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

async function signout(req, res, next){

    const refresh_token = req.cookies.refresh_token ? req.cookies.refresh_token : undefined

    if(refresh_token){

        await Token.findOneAndDelete({"token": refresh_token})

    }

    res.clearCookie('refresh_token');
            
    res.status(403).json({ 
        message: 'Not authorized.', 
        user: { 
                email: "", 
                username: "", 
                projects: [], 
                permissions: [], 
                access_token: "", 
                isAuth: false 
            }
    });

}

async function getUser(req, res, next){

    try{

        const user_id = req.user_id;
    
        const user = await User.findById(user_id).populate('projects', ["title", "description", "logo_url"]);

    
        const { _id, email, username, projects, permissions } = user;
    
        const access_token = await createAccessToken({user_id: _id.toString()})
    
        res.status(201).json({ 
            message: 'User Signed in!', 
            user: { 
                    email: email, 
                    username: username, 
                    projects: projects, 
                    permissions: permissions, 
                    access_token: access_token, 
                    isAuth: true 
                }
        });
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error getting user";

        err.body = { 
            user: { 
                email: "", 
                username: "", 
                projects: "", 
                permissions: "", 
                access_token: "", 
                isAuth: false 
            }}

        next(err);

    }

}

async function emailAvailable(req, res, next){

    const email = req.body.email;

    User.exists({email: email}, (err, doc) => {

        res.status(200).json({available: doc === null});

    })

}


export default {

    signup,
    signin,
    signout,
    getUser,
    emailAvailable
}
