import express from "express";
import { getAllStudentsWithBills, payBill } from "../controller/billController";


const router = express.Router();

// Get all students with their bills
router.get("/", getAllStudentsWithBills);

// Pay a bill
router.put("/pay/:id", payBill);

export default router;
