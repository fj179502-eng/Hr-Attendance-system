import express from "express";
import { addEmployee, getAllEmployee, getEmployee, updateEmployee, deleteEmployee } from "../controller/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/employee", verifyToken, addEmployee);
router.get("/employee", verifyToken, getAllEmployee);
router.get("/employee/:id", verifyToken, getEmployee);
router.put("/employee/:id", verifyToken, updateEmployee);
router.delete("/employee/:id", verifyToken, deleteEmployee);

export default router;