
import Badge from "../models/badge.model.js";
import Project from "../models/project.model.js";

async function createBadge(req, res, next){

    try{

        const title = req.body.title;
        const color = req.body.color;
        const project_id = req.body.project_id;


        const badge = await new Badge({
            
            project: project_id,
            title: title,
            color: color
            
        });
            
    
        // await badge.save();

        const project = await Project.findById(project_id);

    
        await project.badges.push(badge);

        await project.save();
    
        res.status(201).json({ message: 'Badge created!'});

    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Badge";

        next(err);

    }

}

export default {

    createBadge
}



