import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "faisal.12",
    database: process.env.DB_NAME || "hr_and_attendance_system",
})
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database Connection Error", err);
    }
    console.log("Database Connected Successfully");
})
export default pool;