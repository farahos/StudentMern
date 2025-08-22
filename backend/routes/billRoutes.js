import express from "express";
import { getBills, markAsPaid } from "../controller/billController.js";


const router = express.Router();

router.get("/", getBills);
router.put("/:id/pay", markAsPaid);

export default router;

