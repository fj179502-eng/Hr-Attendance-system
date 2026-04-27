import pool from "../config/db.js";

export const addPayroll = async (req, res) => {
    try {
        const { employee_id, salary_month, base_salary, absents, deductions, bonus, net_salary } = req.body;
        if (!employee_id || !salary_month || !base_salary || !absents || !deductions || !bonus || !net_salary) {
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
            return res.status(404).json("Employee record not found. Please create an employee profile first.");
        }

        const result = await pool.query(`INSERT INTO payroll(employee_id,salary_month,base_salary,absents,deductions,bonus,net_salary)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *`, [real_emp_id, salary_month, base_salary, absents, deductions, bonus, net_salary]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllPayroll = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM payroll`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getPayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM payroll WHERE pay_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, salary_month, base_salary, absents, deductions, bonus, net_salary } = req.body;
        if (!employee_id || !salary_month || !base_salary || !absents || !deductions || !bonus || !net_salary) {
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

        const result = await pool.query(`UPDATE payroll SET employee_id=$1,salary_month=$2,base_salary=$3,absents=$4,deductions=$5,bonus=$6,net_salary=$7 WHERE pay_id=$8 RETURNING *`, [real_emp_id, salary_month, base_salary, absents, deductions, bonus, net_salary, id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM payroll WHERE pay_id=$1`, [id]);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}