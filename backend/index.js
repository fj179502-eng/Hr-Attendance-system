import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./route/authRoutes.js";
import departmentRoute from "./route/departmentRoute.js";
import employeeRoutes from "./route/employeeRoutes.js";
import attendanceRoutes from "./route/attendanceRoutes.js";
import leaveTypeRoutes from "./route/leaveTypeRoutes.js";
import leaveBalanceRoutes from "./route/leaveBalanceRoutes.js";
import leaveRequestRoutes from "./route/leaveRequestRoutes.js";
import payrollRoutes from "./route/payrollRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/register", authRoutes);
app.use("/api/department", departmentRoute);
app.use("/api/employee", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/type", leaveTypeRoutes);
app.use("/api/balance", leaveBalanceRoutes);
app.use("/api/request", leaveRequestRoutes);
app.use("/api/payroll", payrollRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})