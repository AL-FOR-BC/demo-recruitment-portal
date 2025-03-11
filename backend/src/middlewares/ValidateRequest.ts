import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const ValidateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      res.status(400).json({ errors });
    } else {
      next();
    }
  };
};
