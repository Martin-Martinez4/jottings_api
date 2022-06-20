
import Project from "../models/project.model.js";

async function createProject(req, res, next){

    try{

        const title = req.body.title;
    
        // id of creator to be input as [_id]
        const user_id = req.body.user_id;
    
        const project = await new Project({
    
            title: title,
            users: [user_id]
    
        });
    
        await project.save();
    
        res.status(201).json({ message: 'Project created!'});

    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Project";

        next(err);

    }

}

export default {

    createProject
}


