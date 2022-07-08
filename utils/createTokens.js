
import jwt from "jsonwebtoken";

import Token from "../models/refreshToken.model.js";
import { storeToken } from "./storeToken.js";


export async function createAccessToken(objectToStore){

    const accessTokenSecret = process.env.ACCESS_SECRET;

    // expiresIn: seconds
    const access_token = jwt.sign(objectToStore, accessTokenSecret, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_IN_SECONDS)});

    return access_token;

}

export async function createRefreshToken(objectToStore){

    const refreshTokenSecret = process.env.REFRESH_SECRET;

    // expiresIn: seconds
    const refresh_token = jwt.sign(objectToStore, refreshTokenSecret, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS)});

    return refresh_token;

}

export async function createStoreSendTokens(user_id){

    try{
        // user_id should come from signin function
        const refresh_token = await createRefreshToken({user_id: user_id});
        const access_token = await createAccessToken({user_id: user_id});

        // send to dataBase 

        await storeToken(refresh_token, Token);
        


        return ({ access_token: access_token, refresh_token: refresh_token });
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error creating token";

        return err
    }
}
