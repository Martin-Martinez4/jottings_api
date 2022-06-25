
import Task from "../models/task.model.js";
import Category from "../models/category.model.js";
import Project from "../models/project.model.js";

import {conn} from "../server.js";

async function createTask(req, res, next){

    try{

        const content = req.body.content;
        const title = req.body.title;
        const category_id = req.body.category_id;
        const project_id = req.body.project_id;
        const badges = req.body.badges;

        const task = 
                    badges?
                    await new Task({
        
                        title: title,
                        content: content,
                        category: category_id,
                        badges: badges
                
                    })
                    : 
                    await new Task({
        
                        title: title,
                        content: content,
                        category: category_id,
                
                    })
    
    
        const project = await Project.findById(project_id);
        const tasks = project.category.id(category_id).tasks;

        tasks.push(task)

        project.save();

        let tasksObj = {}
        let categoryToSend = {}

        const category = project.category.id(category_id).tasks;

        category.forEach(task => {

            tasksObj[task._id] = task

        })

        categoryToSend[category_id] = tasksObj

    
        res.status(201).json({ new_tasks_object: categoryToSend, message: 'task created!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Creating Task";

        next(err);
        
    }

}

async function deleteTask(req, res, next){

    const session = await conn.startSession();
    session.startTransaction();

    try{

        const opts = { session, new: true };


        // console.log(req.body)


        const project_id = req.body.project_id;
        const category_id = req.body.category_id;
        const task_id = req.body.task_id;

        const badge_relations = req.body.badge_relations;

        const project = await Project.findById(project_id);
        const tasks = await project.category.id(category_id).tasks.pull({ _id: task_id });

        
        const taskBadges = project.taskBadgesRelation.filter(realtion => {

            if( badge_relations.includes(realtion._id.toString()) ){

                project.taskBadgesRelation.pull(realtion)
            }
            
        });

        project.save();

        let tasksObj = {}
        let categoryToSend = {}

        const category = project.category.id(category_id).tasks;

        category.forEach(task => {

            tasksObj[task._id] = task

        })

        categoryToSend[category_id] = tasksObj

        res.status(201).json({ new_tasks_object: categoryToSend, message: 'task deleted!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error deleting Task";

        next(err);
        
    }


}


async function updateTask(req, res, next){

    try{

        const project_id = req.body.project_id;
        const category_id = req.body.category_id;
        const task_id = req.body.task_id;

        const content = req.body.content;

        const project = await Project.findById(project_id);

        let tasks = await project.category.id(category_id).tasks.id(task_id);

        tasks.content = content;

        await project.save();

        res.status(201).json({ message: 'task updated!'});
    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error updating Task";

        next(err);
        
    }

}

// Keeping as refernce for transactions

// async function deleteTask (req, res, next){

//     const session = await conn.startSession();
//     session.startTransaction();
//     try{

//         const task_id = req.body.task_id;
//         const category_id = req.body.category_id;

//         // Add validation for task_id and categor_id
//         const opts = { session, new: true };
    
//         const task = await Task.findByIdAndRemove({_id: task_id}, opts);

//         const result = await Category.findOneAndUpdate( 
//             { _id: category_id }, 
//             { $pullAll: { tasks: [task_id] } },
//             opts,  
//         );

//         await session.commitTransaction();
//         session.endSession();

//         res.status(201).json({ message: 'Task deleted!'});
//     }
//     catch(err){

//         await session.abortTransaction();
//         session.endSession();

//         err.statusCode = err.statusCode | 500;

//         err.message =  err.message | "Error Deleting Task";

//         next(err);
        
//     }
//     // finally{

//     //     session.endSession()
//     // }
  


// } 

export default {

    createTask,
    deleteTask,
    updateTask

}



