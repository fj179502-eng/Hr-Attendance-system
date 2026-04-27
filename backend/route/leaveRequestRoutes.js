import express from "express";
import { addLeaveRequest, getAllLeaveRequest, getLeaveRequest, updateLeaveRequest, deleteLeaveRequest } from "../controller/leaveRequestController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/request", verifyToken, addLeaveRequest);
router.get("/request", verifyToken, getAllLeaveRequest);
router.get("/request/:id", verifyToken, getLeaveRequest);
router.put("/request/:id", verifyToken, updateLeaveRequest);
router.delete("/request/:id", verifyToken, deleteLeaveRequest);

export default router;
