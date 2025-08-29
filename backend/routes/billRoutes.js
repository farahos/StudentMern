import express from "express";
import { getStudentBills, payBill } from "../controller/billController";


const router = express.Router();

// Get bills for a student
router.get("/", getStudentBills);

// Pay a bill
router.put("/pay/:id", payBill);

export default router;
