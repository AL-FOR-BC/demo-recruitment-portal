// import { prisma } from "../utils/Prismadb";
import axios from "axios";
import express, { NextFunction, Request, Response } from "express";
import { getDB } from "../utils/database";

export const BCAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const db = getDB();
    const config = await db.bc_configs.findUnique({
      where: { id: "2" },
    });
    console.log(config);

    if (!config) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    const { tenant, clientSecret, clientId } = config;
    const url: string = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
    const data = new URLSearchParams({
      scope: "https://api.businesscentral.dynamics.com/.default",
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.json(response.data);
  } catch (e) {
    console.error("Error fetching token:", e);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the token" });
  }
};

export const GetBcConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = getDB();
    const config = await db.bc_configs.findUnique({
      where: { id: "2" },
    });

    return res.json(config);
  } catch (e) {
    console.error("Error fetching config:", e);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the config" });
  }
};
