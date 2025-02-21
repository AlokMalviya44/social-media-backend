import multer from "multer";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5 MB
  },
});

export const handleFileUpload = upload.single("image");

export const validateComment = [
  body("post")
    .notEmpty()
    .withMessage("Post is required")
    .custom((postId) => {
      return mongoose.Types.ObjectId.isValid(postId);
    })
    .withMessage("Invalid postId"),

  body("text").notEmpty().withMessage("text is required"),
  body("parentComment")
    .optional()
    .custom((commentId) => {
      return mongoose.Types.ObjectId.isValid(commentId);
    })
    .withMessage("Invalid parent comment"),

  (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    return next();
  },
];
