
import Project from "../models/project.model.js";
import User from "../models/user.model.js";


async function getProject(req, res, next){

    try{

        const project_id = req.params.id;

        const project = await Project.findById(project_id);

        let projectToSend = {project_id: project._id, title: project.title, length: project.length}

        let taskBadgeObj = {};

        let categories = {};

        let tasksToSend = {};


        if(project?.taskBadgesRelation?.length <= 0){

            project.taskBadgesRelation.forEach(object => {
    
                const key = object.Task
    
                if(taskBadgeObj[key] === undefined){
    
                    taskBadgeObj[key] = [object.Badges.toString()]
                }else{
    
                    taskBadgeObj[key].push(object.Badges.toString())
                }
    
                
            });
        }

        project?.category.forEach( object => {

            const cat_id = object._id.toString();


            object?.tasks.forEach(task => {

                const task_id = task._id.toString()

                if(tasksToSend[cat_id] === undefined){

                    tasksToSend[cat_id] = {}

                }


                tasksToSend[cat_id][task_id] = task

            })

            categories[cat_id] = {_id: object._id, title: object.title, index: object.index, length: object.length};

        })



        res.status(201).json({ project: projectToSend, categories: categories, tasks: tasksToSend, message: 'Project gotten!'});
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
        const user_id = req.user_id;
        const logo_url = req.body.url_logo;
        const description = req.body.description;

    
        const project = await new Project({
    
            title: title,
            logo_url: logo_url? logo_url : "",
            description: description,
            users: [user_id]
    
        });
    
        await project.save();

        const userById = await User.findById(user_id)
        await userById.projects.push(project._id.toString())
        await userById.save();
        const user = await User.findById(user_id).populate('projects', ["title", "description", "logo_url"]);

        const { projects } = user
    
        res.status(201).json({ message: 'Project created!', projects: projects});
        // res.status(201).json({ message: 'Project created!'});

    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Project";

        next(err);

    }

}

async function editProject(req, res, next){

    try{

        const user_id = req.user_id;
        const project_id = req.body.project_id;

        const title = req.body.title;
        const description = req.body.description;
        const logo_url = req.body.logo_url;

        const project = await Project.findById(project_id);

        project.title = title;
        project.description = description;
        project.logo_url = logo_url;

        await project.save();

        const user = await User.findById(user_id).populate('projects', ["title", "description", "logo_url"]);

        const { projects } = user
    
        res.status(201).json({ message: 'Project title changed!', projects: projects});

    }
    catch(err){
    
        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error changing project title";

        next(err);

    }

}

async function deleteProject(req, res, next){

    const user_id = req.user_id;
    const project_id = req.body.project_id;


    try{


        await Project.findByIdAndRemove(project_id);

        const user = await User.findById(user_id).populate('projects', ["title", "description", "logo_url"]);

        const { projects } = user
    
        res.status(201).json({ message: 'Project delted!', projects: projects});

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


