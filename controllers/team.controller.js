

import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import { ObjectId } from "mongodb";

export async function createTeam(req, res, body){

    const name = req.body.name;
    const user_id = req.body.user_id;

    // const user_id = req.user_id


    const team = new Team({
        
        name: name,
        proejcts: [],
        members: [ObjectId(user_id)]

    });

    const user = await User.findById(user_id);

    user.teams.push(team._id);

    team.save();
    user.save();

    res.status(201).json({ message: 'Team Created!'});



}


export async function addProjectToTeam(req, res, body){

    const team_id = req.body.team_id;
    const project_id = req.body.project_id;

    

    const team = await Team.findById(team_id);

    team.projects.push(project_id);

    team.save();

    res.status(201).json({ message: 'Project added to team!'});



}

export default {

    createTeam,
    addProjectToTeam,
}


