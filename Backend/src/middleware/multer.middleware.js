import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join(process.cwd(), "public", "temp");

// Make sure folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Relative path, safe on Windows
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // you can also add timestamp for uniqueness
  },
});

export const upload = multer({ storage });
