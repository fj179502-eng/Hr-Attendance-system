import pool from "../config/db.js";
export const addEmployee = async (req, res) => {
    try {
        const { user_id, emp_code, phone, address, gender, cnic, joining_date, base_salary, dept_id, designation, photo_url, status } = req.body;
        if (!user_id || !emp_code || !phone || !address || !gender || !cnic || !joining_date || !base_salary || !dept_id || !designation || !photo_url || !status) {
            return res.status(402).json("All fields are required");
        }
        const result = await pool.query(`INSERT INTO employees(user_id,emp_code,phone,address,gender,cnic,joining_date,base_salary,dept_id,designation,photo_url,status)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)RETURNING *`, [user_id, emp_code, phone, address, gender, cnic, joining_date, base_salary, dept_id, designation, photo_url, status]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getAllEmployee = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM employees`);
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM employees WHERE emp_id=$1`, [id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, emp_code, phone, address, gender, cnic, joining_date, base_salary, dept_id, designation, photo_url, status } = req.body;
        if (!user_id || !emp_code || !phone || !address || !gender || !cnic || !joining_date || !base_salary || !dept_id || !designation || !photo_url || !status) {
            return res.status(402).json("All fields are required");
        }
        const result = await pool.query(`UPDATE employees SET user_id=$1,emp_code=$2,phone=$3,address=$4,gender=$5,cnic=$6,joining_date=$7,base_salary=$8,dept_id=$9,designation=$10,photo_url=$11,status=$12 WHERE emp_id=$13 RETURNING *`, [user_id, emp_code, phone, address, gender, cnic, joining_date, base_salary, dept_id, designation, photo_url, status, id]);
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM employees WHERE emp_id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};
