import express from "express";
import { addDepartment, getDepartmentById, getAllDepartment, updateDepartment, deleteDepartment } from "../controller/departmentController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
// import { allowRoles } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.post("/department", verifyToken, addDepartment);
router.get("/department", verifyToken, getAllDepartment);
router.get("/department/:id", verifyToken, getDepartmentById);
router.put("/department/:id", verifyToken, updateDepartment);
router.delete("/department/:id", verifyToken, deleteDepartment);
export default router;