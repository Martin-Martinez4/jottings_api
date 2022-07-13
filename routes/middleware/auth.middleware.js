
import jwt from "jsonwebtoken";

import Token from "../../models/refreshToken.model.js"

export const validateVerifyToken = async (req, res, next) => {

    try{


        const refresh_token  = req.cookies.refresh_token;

        // Validate
        // Check if token in mongoDb            

        Token.exists({token: refresh_token.toString()}, (err, doc) => {

            if(err || doc === null){

                // Remove tokens
                res.clearCookie('refresh_token');
                
                res.status(403).json({ 
                    message: 'An authentication error occured.', 
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
            else{

                jwt.verify(
                    refresh_token,
                process.env.REFRESH_SECRET,
                (err, decoded) => {
                    if (err){
    
                        /*
                            err = {
                                name: 'TokenExpiredError',
                                message: 'jwt expired',
                                expiredAt: 1408621000
                            }
                        */
                                                    
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
                        }); //invalid token
    
                    }
    
                    
                    // also return access token
                    
                    req.user_id = decoded.user_id;
        
                    next();
                })

            }
          


        })
       
          
    }
    catch(err){


        err.statusCode = err.statusCode | 403;

        err.message =  err.message | "Error signing in Category";

        err.body = { 
            email: "", 
            username: "", 
            projects: [], 
            permissions: [], 
            access_token: "", 
            isAuth: false 
        }

        next(err);

    }

    
}

