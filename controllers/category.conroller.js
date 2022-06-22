
import Category from "../models/category.model.js";
import Project from "../models/project.model.js";

import {conn} from "../server.js";

async function createCategory(req, res, next){

    try{

        const title = req.body.title;
        const project_id = req.body.project_id;
    
        const category = await new Category({
    
            title: title,
            project: project_id
    
        })
        
        // await category.save();
    
        const project = await Project.findById(project_id);

    
        await project.category.push(category);

        await project.save();

        res.status(201).json({ message: 'Category created!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Category";

        next(err);
        
    }

}

async function deleteCategory(req, res, next){

    const session = await conn.startSession();
    session.startTransaction();

    try{
        const opts = { session, new: true };


        const project_id = req.body.project_id;
        const category_id = req.body.category_id;

        const project = await Project.findById(project_id);

        const category = project.category.id(category_id);

        const tasks = category.tasks

        const taskIdsArray = tasks.map(task => {

            return task._id.toString()
        })


        let toPull = []
        
        project.taskBadgesRelation.forEach(object => {

            if(taskIdsArray.includes(object.Task.toString())){

                toPull.push(object)
            }

        }, opts);

        toPull.forEach(async object => {
            
            await project.taskBadgesRelation.pull(object, opts)
        })


        await project.category.pull({_id: category_id}, opts)

        project.save();
        

        res.status(201).json({ message: 'Category created!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Category";

        next(err);
        
    }


}

async function editCategory(req, res, next){

    try{

    const project_id = req.body.project_id;
    const title = req.body.title;

    const project = Project.findById(project_id);

    const category = project.category.id(category_id);

    category.title = title;

    project.save();

    res.status(201).json({ message: 'Category title changed!'});

}
catch(err){

    err.statusCode = err.statusCode | 500;

    err.message =  err.message | "Error changing category title";

    next(err);
    
}

}


export default {

    createCategory,
    deleteCategory

}


