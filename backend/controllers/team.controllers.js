const Team = require("../models/team.model.js");

const getTeam = async (req, res) => {
    try {
        const { teamID } = req.params;
        const team = await Team.findById(teamID);
        res.status(200).json({ team });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTeam = async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json({ team });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { teamID } = req.params;
        const team = await Team.findOneAndUpdate({ _id: teamID }, req.body, { new: true, runValidators: true });
        if (!team)
            return res.status(404).json({ message: "No Such Team" });

        res.status(200).json({ team, success: "Update Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const { teamID } = req.params;
        const team = await Team.findOneAndDelete({ _id: teamID });
        if (!team)
            return res.status(404).json({ message: "No Such Team" });

        res.status(200).json({ team, success: "Deletion Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTeam, getTeam, updateTeam, deleteTeam };
