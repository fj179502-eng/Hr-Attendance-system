import express from "express";
import { addPayroll, getAllPayroll, getPayroll, updatePayroll, deletePayroll } from "../controller/payrollController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/payroll", verifyToken, addPayroll);
router.get("/payroll", verifyToken, getAllPayroll);
router.get("/payroll/:id", verifyToken, getPayroll);
router.put("/payroll/:id", verifyToken, updatePayroll);
router.delete("/payroll/:id", verifyToken, deletePayroll);

export default router;