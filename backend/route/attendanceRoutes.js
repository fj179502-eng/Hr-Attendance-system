import express from "express";
import { addAttendance, getAllAttendance, getAttendance, updateAttendance, deleteAttendance } from "../controller/attendanceController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/attendance", verifyToken, addAttendance);
router.get("/attendance", verifyToken, getAllAttendance);
router.get("/attendance/:id", verifyToken, getAttendance);
router.put("/attendance/:id", verifyToken, updateAttendance);
router.delete("/attendance/:id", verifyToken, deleteAttendance);

export default router;