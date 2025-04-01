// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";

// const prisma = new PrismaClient();

// // ✅ Save QR Code to Database
// export const saveQRCode = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { destination, description } = req.body;
//     const qrImage = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!destination || !description || !qrImage) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newQR = await prisma.qRCode.create({
//       data: { destination, description, image: qrImage },
//     });

//     return res.status(201).json({ message: "QR Code saved!", data: newQR });
//   } catch (error) {
//     console.error("Error saving QR Code:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const deleteQRCode = async (req: Request, res: Response):Promise<any> => {
//   const { id } = req.params;

//   try {
//     // Find QR code in the database
//     const qrCode = await prisma.qRCode.findUnique({ where: { id: Number(id) } });
//     if (!qrCode) return res.status(404).json({ message: "QR Code not found" });

//     // Delete the image file
//     const imagePath = path.join(__dirname, "../uploads", path.basename(qrCode.image));
//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath); // Delete image from uploads folder
//     }

//     // Delete from the database
//     await prisma.qRCode.delete({ where: { id: Number(id) } });

//     return res.status(200).json({ message: "QR Code deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting QR Code:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Get All QR Codes
// export const getAllQRCodes = async (req: Request, res: Response):Promise<any> => {
//   try {
//     const qrCodes = await prisma.qRCode.findMany();
//     return res.status(200).json(qrCodes);
//   } catch (error) {
//     console.error("Error fetching QR Codes:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

// ✅ Save QR Code to Database
export const saveQRCode = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { exactPlaceName, destination, description } = req.body;
    const qrImage = req.file ? `/uploads/${req.file.filename}` : null;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!exactPlaceName || !destination || !description || !qrImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQR = await prisma.qRCode.create({
      data: { exactPlaceName, destination, description, image: qrImage , userId : req.user.userId},
    });

    return res.status(201).json({ message: "QR Code saved successfully!", data: newQR });
  } catch (error) {
    console.error("Error saving QR Code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete QR Code from Database and Remove Image
export const deleteQRCode = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    // Find QR code in the database
    const qrCode = await prisma.qRCode.findUnique({ where: { id: Number(id) } });
    if (!qrCode) return res.status(404).json({ message: "QR Code not found" });

    // Delete the image file if it exists
    if (qrCode.image) {
      const imagePath = path.join(__dirname, "../uploads", path.basename(qrCode.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete from the database
    await prisma.qRCode.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "QR Code deleted successfully" });
  } catch (error) {
    console.error("Error deleting QR Code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All QR Codes
export const getAllQRCodes = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }    

    const qrCodes = await prisma.qRCode.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        exactPlaceName: true,
        destination: true,
        description: true,
        image: true,
      },
    });

    res.status(200).json(qrCodes);
  } catch (error) {
    console.error("Error fetching QR Codes:", error);
    res.status(500).json({ message: "Server error" });
  }
};