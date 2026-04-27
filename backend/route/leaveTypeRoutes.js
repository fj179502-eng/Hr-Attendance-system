import express from "express";
import {
    addLeaveType, getAllLeaveType, getLeaveType, updateLeaveType, deleteLeaveType
} from "../controller/leaveTypeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addLeaveType);
router.get("/", verifyToken, getAllLeaveType);
router.get("/:id", verifyToken, getLeaveType);
router.put("/:id", verifyToken, updateLeaveType);
router.delete("/:id", verifyToken, deleteLeaveType);

export default router;