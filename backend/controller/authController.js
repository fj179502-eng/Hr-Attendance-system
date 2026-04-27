import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { full_name, email, role, password } = req.body;
        if (!full_name || !email || !role || !password) {
            return res.status(402).json("All fields are required");
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`INSERT INTO users(full_name,email,role,password)values($1,$2,$3,$4)RETURNING *`, [full_name, email, role, hashedpassword]);

        return res.status(200).json({
            message: "User Registration successfully",
            user_id: result.rows[0].user_id,
            full_name: result.rows[0].full_name,
            email: result.rows[0].email,
            role: result.rows[0].role,
            password: result.rows[0].password,
            token: generateToken(result.rows[0])
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(402).json("All fields are required");
        }

        const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json("Invalid Email or Password");
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json("Invalid Email or Password");
        }

        return res.json({
            message: "User login successfully",
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json("Database Error");
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT user_id, full_name, email, role FROM users ORDER BY user_id DESC"
        );
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
    }
};

