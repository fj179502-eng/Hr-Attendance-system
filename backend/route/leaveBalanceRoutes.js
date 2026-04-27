import express from "express";
import { AddLeaveBalance,getAllLeaveBalance,getLeaveBalance,updateLeaveBalance,deleteLeaveBalance } from "../controller/leaveBalanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router=express.Router();

router.post("/balance",verifyToken,AddLeaveBalance);
router.get("/balance",verifyToken,getAllLeaveBalance);
router.get("/balance/:id",verifyToken,getLeaveBalance);
router.put("/balance/:id",verifyToken,updateLeaveBalance);
router.delete("/balance/:id",verifyToken,deleteLeaveBalance);

export default router;