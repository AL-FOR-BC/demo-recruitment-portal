import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";

export const isEmptyObject = (obj: any) => {
  return Object.entries(obj).length === 0;
};

export const checkDatabaseConnection = async (prisma: PrismaClient, 
  res:Response,
  next:NextFunction
) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });

  }
};

