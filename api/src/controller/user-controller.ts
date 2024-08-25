import { Request, Response } from "express";
export const uploadImage = async (req: Request, res: Response) => {
  if (req.file) {
    const profileImage = req.file as Express.MulterS3.File;
    return res.status(200).send({ location: profileImage.location });
  } else {
    res.status(200).send({ location: "" });
  }
};
