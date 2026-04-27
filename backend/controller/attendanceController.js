import pool from "../config/db.js";

export const addAttendance = async (req, res) => {
    try {
        const { employee_id, att_date, check_in, check_out, status, remarks } = req.body;
        if (!employee_id || !att_date || !check_in || !check_out || !status || !remarks) {
            return res.status(402).json("All fields are required");
        }

        let real_emp_id = null;

        // Check if the provided ID is a user_id linked to an employee
        const empByUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);

        if (empByUser.rows.length > 0) {
            real_emp_id = empByUser.rows[0].emp_id;
        } else {
            // Check if it is already an emp_id
            // We need to cast to integer or handle potential errors if it's not a number, but usually IDs are ints.
            // However, assuming standard usage, let's try to query by emp_id.
            try {
                const empById = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
                if (empById.rows.length > 0) {
                    real_emp_id = empById.rows[0].emp_id;
                }
            } catch (ignore) {
                // If syntax error (invalid input syntax for integer), just ignore
            }
        }

        if (!real_emp_id) {
            return res.status(404).json("Employee record not found");
        }

        const result = await pool.query(`INSERT INTO attendance(employee_id,att_date,check_in,check_out,status,remarks)VALUES($1,$2,$3,$4,$5,$6)RETURNING *`, [real_emp_id, att_date, check_in, check_out, status, remarks]);

        // Add emp_id to the response for frontend compatibility
        const responseData = result.rows[0];
        responseData.emp_id = real_emp_id;

        return res.status(200).json(responseData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllAttendance = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM attendance`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Databse Error");
    }
}

export const getAttendance = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(`SELECT * FROM attendance WHERE att_id=$1`, [id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Databse Error");
    }
}

export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, att_date, check_in, check_out, status, remarks } = req.body;
        if (!employee_id || !att_date || !check_in || !check_out || !status || !remarks) {
            return res.status(402).json("All fields are required");
        }

        let real_emp_id = null;
        // Check if the provided ID is a user_id linked to an employee
        const empByUser = await pool.query('SELECT emp_id FROM employees WHERE user_id = $1', [employee_id]);

        if (empByUser.rows.length > 0) {
            real_emp_id = empByUser.rows[0].emp_id;
        } else {
            // Check if it is already an emp_id
            try {
                const empById = await pool.query('SELECT emp_id FROM employees WHERE emp_id = $1', [employee_id]);
                if (empById.rows.length > 0) {
                    real_emp_id = empById.rows[0].emp_id;
                }
            } catch (ignore) { }
        }

        if (!real_emp_id) {
            return res.status(404).json("Employee record not found");
        }

        const result = await pool.query(`UPDATE attendance SET employee_id=$1, att_date=$2, check_in=$3, check_out=$4, status=$5, remarks=$6 WHERE att_id=$7 RETURNING *`, [real_emp_id, att_date, check_in, check_out, status, remarks, id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}


export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(`DELETE  FROM attendance WHERE att_id=$1`, [id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Databse Error");
    }
}