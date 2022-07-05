
import { reorderOneDimension } from "../utils/reorder.js";
import Category from "../models/category.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

import {conn} from "../server.js";

async function createCategory(req, res, next){

    try{

        const title = req.body.title;
        const project_id = req.body.project_id;

        const project = await Project.findById(project_id);
    
        const category = await new Category({
            
            title: title,
            project: project_id,
            index: project.length
            
        })
        
        await category.save();
        
        
        
        await project.category.push(category);
        
        project.length += 1;

        await project.save();

        const new_category_object = {[category._id]: {title: category.title, _id: category._id, index: category.index }}


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

        const category_index = category.index;

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


        await project.category.pull({_id: category_id}, opts);

        tasks.forEach(task => {

            if(task.index > category_index){

                task.index -= 1;

            }
        })

        project.length -= 1;

        await project.save();

        let categoriesToSend = {}

        project?.category.forEach( object => {

            const cat_id = object._id.toString();


            categoriesToSend[cat_id] = {_id: object._id, title: object.title, index: object.index};

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

    const original_index = req.body.original_index;
    const target_index = req.body.target_index;

    let tasksToSend = {}

    try{

        const project = await Project.findById(project_id);

        const oldCategory = await project.category.id(category_id);

        let task = await oldCategory.tasks.id(task_id);
        const targetCategory = await project.category.id(target_category_id);


        const taskToInsert = (original_index != undefined && target_index != undefined)
            ? new Task({

                title: task.title,
                content: task.content,
                index: target_index
            })
            : new Task({

                title: task.title,
                content: task.content,
                index: targetCategory.length
            })



        await targetCategory.tasks.push(taskToInsert);
        await oldCategory.tasks.pull(task_id)
                
        if(original_index === undefined || target_index === undefined){

            
            oldCategory.tasks.forEach(task => {
    
                if(task.index > original_index){
                    
                    task.index -= 1;
                    
                }
                
            })

        }
        else{

            oldCategory.tasks.forEach(task => {
    
                if(task.index > original_index){
    
                    task.index -= 1;
    
                }
    
            })
    
            targetCategory.tasks.forEach(task => {
    

                if(task.index >= target_index && (task._id != taskToInsert._id)){
    
                    task.index += 1;
    
                }
    
    
            })
        }


        oldCategory.length -= 1;
        targetCategory.length += 1;

        project.save();
        

        [targetCategory, oldCategory].forEach( object => {


            const cat_id = object._id.toString();

            object?.tasks.forEach(task => {

                const task_id = task._id.toString()

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
        
        const project = await Project.findById(project_id);
        
        const category = project.category.id(category_id);

        category.title = title;

        await project.save();

        const categoryToSend = {[category_id]: {title: title, _id: category_id, index: category.index}}

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

        const original_index = parseInt(req.body.original_index);
        const target_index = parseInt(req.body.target_index);

        const project_id = req.body.project_id;
        const category_id = req.body.category_id;
        const task_id = req.body.task_id;

        const project = await Project.findById(project_id)
        
        const tasks =  project.category.id(category_id).tasks

        reorderOneDimension(original_index, target_index, tasks);

        await project.save();

        let categoryToSend = {}

        tasks.forEach(task => {

            const task_id = task._id.toString()

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

async function changeCategoryOrder(req, res, next){

    try{

        // inserts before target_index

        const original_index = req.body.original_index;
        const target_index = req.body.target_index;

        const project_id = req.body.project_id;
        const category_id = req.body.category_id;

        const project = await Project.findById(project_id)


        const categories =  project.category

        reorderOneDimension(original_index, target_index, categories);
        
        await project.save();

        let categoryToSend = {}

        categories.forEach(category => {

            const category_id = category._id.toString()

            if(categoryToSend[category_id] === undefined){

                categoryToSend[category_id] = {}

            }


            categoryToSend[category_id] = {_id: category._id, title: category.title, index: category.index};

        })


        res.status(201).json({ new_categories_object: categoryToSend ,category_id: category_id, message: 'Category title changed!'});

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
    changeTaskOrder,
    changeCategoryOrder

}


