import express from "express";
import upload from "../middlewares/uploadMiddleware";
import { saveQRCode, getAllQRCodes, deleteQRCode } from "../controllers/qrController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// ✅ POST: Save QR Code with Image
router.post("/save-qr", authenticate, upload.single("qrImage"), saveQRCode);

// ✅ GET: Fetch All QR Codes
router.get("/get-all",authenticate, getAllQRCodes);

// ✅ DELETE: Delete a QR Code
router.delete("/delete-qr/:id", authenticate, deleteQRCode);

export default router;
