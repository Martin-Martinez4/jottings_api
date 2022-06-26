
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
        
        await category.save();
    
        const project = await Project.findById(project_id);

    
        await project.category.push(category);

        await project.save();

        const new_category_object = {[category._id]: {title: category.title, _id: category._id }}


        res.status(201).json({ new_category_object: new_category_object, category_id: category._id.toString() ,message: 'Category created!'});
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

        await project.save();

        let categoriesToSend = {}

        project?.category.forEach( object => {

            const cat_id = object._id.toString();


            categoriesToSend[cat_id] = {_id: object._id, title: object.title};

        })
    

        res.status(201).json({ category_id: category_id, new_category_object: categoriesToSend, message: 'Category deleted!'});
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

        res.status(201).json({ tasks: tasksToSend,old_category_id: category_id, new_category_id: target_category_id,  message: 'Category edited!', success: true});
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
        const category_id = req.body.category_id;
        const title = req.body.title;

        console.log(category_id)
        
        const project = await Project.findById(project_id);
        
        const category = project.category.id(category_id);

        category.title = title;

        await project.save();

        const categoryToSend = {[category_id]: {title: title, _id: category_id}}

        res.status(201).json({ new_category_object: categoryToSend ,category_id: category_id, message: 'Category title changed!'});

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error changing category title";

        next(err);
        
    }

}

async function changeTaskOrder(req, res, next){

    try{

        // inserts before target_index

        const original_index = req.body.original_index;
        const target_index = req.body.target_index;

        const project_id = req.body.project_id;
        const category_id = req.body.category_id;
        const task_id = req.body.task_id;

        const project = await Project.findById(project_id)
        
        // console.log(project.category)

        const tasks =  project.category.id(category_id).tasks

        if(original_index < target_index){

            // Moves to the right
            // lower index move to higher position

            tasks.forEach(task => {
                
                if(task.index === original_index){

                    task.index = target_index

                }
                else if((task.index >= original_index + 1) && (task.index <= target_index)){

                    task.index -= 1

                }
    
            })
        }
        else if(original_index > target_index){

            // Moves to the left
            // higher index move to lower position
            tasks.forEach(task => {
                
                if(task.index === original_index){

                    task.index = target_index

                }
                else if((task.index >= target_index) && (task.index < original_index)){

                    task.index += 1

                }
    
            })

        }

        
        await project.save();

        let categoryToSend = {}

        tasks.forEach(task => {

            const task_id = task._id.toString()

            // console.log(task)
            if(categoryToSend[category_id] === undefined){

                categoryToSend[category_id] = {}

            }


            categoryToSend[category_id][task_id] = task

        })



        res.status(201).json({ new_category_object: categoryToSend ,category_id: category_id, message: 'Category title changed!'});

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
    changeTaskOrder

}


