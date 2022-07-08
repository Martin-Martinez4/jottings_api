
export async function storeToken(tokenToInsert, token_model){

    try{

        const token = new token_model({
    
            token: tokenToInsert
    
        });
    
        await token.save();

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error storing token";

        next(err);

    }


}

