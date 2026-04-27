import pool from "../config/db.js";

export const AddLeaveBalance = async (req, res) => {
    try {
        const { employee_id, sick, casual, annual } = req.body;
        if (employee_id == null || sick == null || casual == null || annual == null) {
            return res.status(400).json("All fields are required");
        }
        // support passing either a user_id or an emp_id from the client
        let real_emp_id = null;
        const byUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);
        if (byUser.rows.length > 0) real_emp_id = byUser.rows[0].emp_id;
        else {
            const byEmp = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
            if (byEmp.rows.length > 0) real_emp_id = byEmp.rows[0].emp_id;
        }
        if (!real_emp_id) {
            return res.status(400).json("Provided employee identifier does not exist");
        }
        const result = await pool.query(`INSERT INTO leave_balance(employee_id,sick,casual,annual)VALUES($1,$2,$3,$4)RETURNING *`, [real_emp_id, sick, casual, annual]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllLeaveBalance = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM leave_balance`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getLeaveBalance = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(`SELECT * FROM leave_balance WHERE balance_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const updateLeaveBalance = async (req, res) => {
    try {
        const { id } = req.params
        const { employee_id, sick, casual, annual } = req.body;
        if (employee_id == null || sick == null || casual == null || annual == null) {
            return res.status(400).json("All fields are required");
        }
        // map provided identifier to emp_id (support user_id or emp_id)
        let real_emp_id = null;
        const byUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);
        if (byUser.rows.length > 0) real_emp_id = byUser.rows[0].emp_id;
        else {
            const byEmp = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
            if (byEmp.rows.length > 0) real_emp_id = byEmp.rows[0].emp_id;
        }
        if (!real_emp_id) {
            return res.status(400).json("Provided employee identifier does not exist");
        }
        const result = await pool.query(`UPDATE leave_balance SET employee_id=$1,sick=$2,casual=$3,annual=$4 WHERE balance_id=$5  RETURNING *`, [real_emp_id, sick, casual, annual, id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}


export const deleteLeaveBalance = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(`DELETE FROM leave_balance WHERE balance_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}