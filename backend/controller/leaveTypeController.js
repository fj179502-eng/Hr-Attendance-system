import pool from "../config/db.js";

export const addLeaveType = async (req, res) => {
    try {
        const { type_name } = req.body;
        if (!type_name) {
            return res.status(400).json("All fields are required");
        }
        const result = await pool.query(`INSERT INTO leave_types (type_name) VALUES ($1) RETURNING *`, [type_name]);
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const getAllLeaveType = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM leave_types`);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const getLeaveType = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM leave_types WHERE type_id=$1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json("Leave Type not found");
        }
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const updateLeaveType = async (req, res) => {
    try {
        const { id } = req.params;
        const { type_name } = req.body;
        if (!type_name) {
            return res.status(400).json("All fields are required");
        }
        const result = await pool.query(`UPDATE leave_types SET type_name=$1 WHERE type_id=$2 RETURNING *`, [type_name, id]);
        if (result.rows.length === 0) {
            return res.status(404).json("Leave Type not found");
        }
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const deleteLeaveType = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM leave_types WHERE type_id=$1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json("Leave Type not found");
        }
        return res.status(200).json({ message: "Leave Type deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};