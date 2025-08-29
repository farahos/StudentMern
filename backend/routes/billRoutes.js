import express from "express";
import { getStudentBills, payBill } from "../controller/billController.js";

const router = express.Router();

// Get bills for a student
router.get("/:id", getStudentBills);

// Pay a bill
router.put("/pay/:id", payBill);

export default router;
