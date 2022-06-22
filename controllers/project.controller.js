
import Project from "../models/project.model.js";

async function getProject(req, res, next){

    try{

        const project_id = req.body.project_id;

        const project = await Project.findById(project_id);

        let taskBadgeObj = {};

        project.taskBadgesRelation.forEach(object => {

            const key = object.Task

            if(taskBadgeObj[key] === undefined){

                taskBadgeObj[key] = [object.Badges.toString()]
            }else{

                taskBadgeObj[key].push(object.Badges.toString())
            }

            
        });


        res.status(201).json({ project: project, taskBadgeObj: taskBadgeObj, message: 'Project gotten!'});
    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error getting Project";

        next(err);

    }


}

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

async function editProject(req, res, next){

    try{

        const project_id = req.body.project_id;
        const title = req.body.title;

        const project = await Project.findById(project_id);

        project.title = title;

        await project.save();
    
        res.status(201).json({ message: 'Project title changed!'});

    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error changing project title";

        next(err);

    }

}

async function deleteProject(req, res, next){

    const project_id = req.body.project_id;

    try{

        await Project.findByIdAndRemove(project_id);

        Project.save();

        res.status(201).json({ message: 'Project deleted changed!'});

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error deleting project title";

        next(err);

    }

}

export default {

    getProject,
    createProject,
    editProject,
    deleteProject
}


