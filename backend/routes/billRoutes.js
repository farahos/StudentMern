import express from "express";
import { createBill, getStudentBills, payBill } from "../controller/billController.js";

const router = express.Router();

router.post("/", createBill); // create a new bill
router.patch("/:billId/pay", payBill); // pay a bill
router.get("/:studentId", getStudentBills); // get student bills

export default router;
