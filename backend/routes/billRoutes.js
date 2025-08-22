import express from "express";
import { getBills, getStudentsWithBillStatus, markAsPaid } from "../controller/billController.js";


const router = express.Router();

router.get("/", getBills);
router.put("/:id/pay", markAsPaid);
router.get("/students-with-bills", getStudentsWithBillStatus);

export default router;

