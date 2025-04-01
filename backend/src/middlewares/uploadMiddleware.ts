import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure 'uploads' folder exists before saving files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `qr_${timestamp}${path.extname(file.originalname)}`);
  },
});

// ✅ File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
