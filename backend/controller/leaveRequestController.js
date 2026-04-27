import pool from "../config/db.js";

export const addLeaveRequest = async (req, res) => {
    try {
        const { employee_id, leave_type_id, from_date, to_date, reason, status } = req.body;
        if (!employee_id || !leave_type_id || !from_date || !to_date || !reason || !status) {
            return res.status(402).json("All fields are required");
        }

        // Map provided identifier to emp_id (support user_id or emp_id)
        let real_emp_id = null;
        const byUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);
        if (byUser.rows.length > 0) {
            real_emp_id = byUser.rows[0].emp_id;
        } else {
            const byEmp = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
            if (byEmp.rows.length > 0) {
                real_emp_id = byEmp.rows[0].emp_id;
            }
        }

        if (!real_emp_id) {
            return res.status(400).json("Provided employee identifier does not exist");
        }

        const result = await pool.query(`INSERT INTO leave_requests(employee_id,leave_type_id,from_date,to_date,reason,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [real_emp_id, leave_type_id, from_date, to_date, reason, status]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Connection Error");
    }
}

export const getLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM leave_requests WHERE request_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Connection Error");

    }
}


export const getAllLeaveRequest = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM leave_requests`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Connection Error");

    }
}



export const updateLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, leave_type_id, from_date, to_date, reason, status } = req.body;
        if (!employee_id || !leave_type_id || !from_date || !to_date || !reason || !status) {
            return res.status(402).json("All fields are required");
        }

        // Map provided identifier to emp_id (support user_id or emp_id)
        let real_emp_id = null;
        const byUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);
        if (byUser.rows.length > 0) {
            real_emp_id = byUser.rows[0].emp_id;
        } else {
            const byEmp = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
            if (byEmp.rows.length > 0) {
                real_emp_id = byEmp.rows[0].emp_id;
            }
        }

        if (!real_emp_id) {
            return res.status(400).json("Provided employee identifier does not exist");
        }

        const result = await pool.query(`UPDATE leave_requests SET employee_id=$1,leave_type_id=$2,from_date=$3,to_date=$4,reason=$5,status=$6 WHERE request_id=$7 RETURNING *`, [real_emp_id, leave_type_id, from_date, to_date, reason, status, id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Connection Error");
    }
}


export const deleteLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM leave_requests WHERE request_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Connection Error");

    }
}