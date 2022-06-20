
import Category from "../models/category.model.js";
import Project from "../models/project.model.js";

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


export default {

    createCategory,

}


