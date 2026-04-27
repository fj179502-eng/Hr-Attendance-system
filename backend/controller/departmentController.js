import pool from "../config/db.js";

export const addDepartment = async (req, res) => {
    try {
        const { dep_name } = req.body;

        if (!dep_name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        const result = await pool.query(
            `INSERT INTO departments(dep_name) VALUES($1) RETURNING *`,
            [dep_name]
        );

        return res.status(201).json({
            message: "Department Added Successfully",
            department: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const getAllDepartment = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM departments ORDER BY dep_id DESC`);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};


export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM departments WHERE dep_id=$1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { dep_name } = req.body;

        if (!dep_name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        const result = await pool.query(
            `UPDATE departments SET dep_name=$1 WHERE dep_id=$2 RETURNING *`,
            [dep_name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        return res.status(200).json({
            message: "Department Updated Successfully",
            department: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM departments WHERE dep_id=$1`, [id]);

        return res.status(200).json({ message: "Department Deleted Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};
