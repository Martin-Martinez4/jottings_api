
import Badge from "../models/badge.model.js";
import Project from "../models/project.model.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import {conn} from "../server.js";

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

async function updateBadge(req, res, next){

    try{

        const project_id = req.body.project_id;
        const badge_id = req.body.badge_id;
        const title = req.body.title;
        const color = req.body.color;

        const project = await Project.findById(project_id);

        const badge = project.badges.id(badge_id);
        
        if(title){

            badge.title = title;
        }

        if(color){

            badge.color = color;
        }
        
        project.save();


        res.status(201).json({ message: 'Badge updated!'});



    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message = err.message | "Error updating badge";

        next(err);

    }

}


async function deleteBadge(req, res, next){

    const project_id = req.body.project_id;
    const badge_id = req.body.badge_id;

    const session = await conn.startSession();
    session.startTransaction();

    try{


        const opts = { session, new: true };

        const project = await Project.findById(project_id).session(session);

        let toPull = []

        await project.taskBadgesRelation.forEach(object => {

            if(object.Badges == badge_id){

                toPull.push(object);
            }

        }, opts);

        toPull.forEach(object => {
            
            project.taskBadgesRelation.pull(object, opts)
        })

        
        await project.badges.pull({_id: badge_id}, opts)

        await session.commitTransaction();
        session.endSession();

        project.save();

    
        res.status(201).json({ message: 'Badge Deleted!'});

    }
    catch(err){

        await session.abortTransaction();
        session.endSession();

        err.statusCode = err.statusCode | 500;

        err.message = err.message | "Error deleting badge";

        next(err);

    }


}

async function deleteBadgeTaskRelation(req, res, next){

    const project_id = req.body.project_id;
    const realtion_id = req.body.realtion_id


    try{

        const project = await Project.findById(project_id);

        await project.taskBadgesRelation.pull(project.taskBadgesRelation.id(realtion_id));

        project.save();

        res.status(201).json({ message: 'Badge removed from task!'});

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message = err.message | "Error removing badge from task";

        next(err);

    }

}

async function createBadgeTaskRelation(req, res, next){

    try{
        const project_id = req.body.project_id;

        const badge_id = req.body.badge_id;
        const task_id = req.body.task_id;

        const project = await Project.findById(project_id)

        // console.log(project)
        const taskBadges = project.taskBadgesRelation.filter(realtion => {

            if(realtion.Task == task_id  && realtion.Badges == badge_id){

                return realtion 
            }
            
        });


        if(taskBadges.length === 0){

            project.taskBadgesRelation.push({Task: task_id, Badges: badge_id})
        }
        else{

            res.status(201).json({ message: 'Badge already exists on the task!'});

        }
      

        project.save();

        res.status(201).json({ message: 'Badge added to task!'});

    }
    catch(err){

        err.statusCode = err.statusCode | 500;

        err.message =  err.message | "Error Adding badge to task";

        next(err);

    }

}

export default {

    createBadge,
    createBadgeTaskRelation,
    deleteBadgeTaskRelation,
    updateBadge,
    deleteBadge
}



