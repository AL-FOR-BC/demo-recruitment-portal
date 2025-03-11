import { Request, Response, NextFunction } from "express";
import { ValidateSignature } from "../utils/PasswordUtility";
import { AuthPayload } from "../dto";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = await ValidateSignature(req);
    if (payload && typeof payload !== "boolean") {
      req.user = payload;
      console.log("Authenticated user:", req.user);
      next();
      return;
    }

    res.status(401).json({ message: "Unauthorized" });
    return;
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
