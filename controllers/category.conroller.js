
import Category from "../models/category.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

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

async function pushTaskInto(req, res, next){

    const project_id = req.body.project_id;
    const category_id = req.body.category_id;
    const task_id = req.body.task_id;
    const target_category_id = req.body.target_category_id;

    let tasksToSend = {}

    try{

        const project = await Project.findById(project_id);

        const oldCategory = await project.category.id(category_id);

        let task = await oldCategory.tasks.id(task_id);

        const taskToInsert = new Task({

            title: task.title,
            content: task.content,
        })

        const targetCategory = await project.category.id(target_category_id);

        targetCategory.tasks.push(taskToInsert);
        oldCategory.tasks.pull(task_id)

        project.save();

        // console.log(targetCategory.tasks)

        [targetCategory, oldCategory].forEach( object => {

            const cat_id = object._id.toString();

            // console.log(cat_id)


            object?.tasks.forEach(task => {

                const task_id = task._id.toString()

                // console.log(task)
                if(tasksToSend[cat_id] === undefined){

                    tasksToSend[cat_id] = {}

                }


                tasksToSend[cat_id][task_id] = task

            })

        })

        res.status(201).json({ tasks: tasksToSend,old_category_id: category_id, new_category_id: target_category_id,  message: 'Category created!', success: true});
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
    deleteCategory,
    editCategory,
    pushTaskInto,

}


