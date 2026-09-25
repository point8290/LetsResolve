import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (req.file) {
    const profileImage = req.file as Express.MulterS3.File;
    res.status(200).json({ location: profileImage.location });
    return;
  }
  res.status(200).json({ location: "" });
});
