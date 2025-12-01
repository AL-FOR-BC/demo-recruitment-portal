import { IDatabaseAdapter } from "./adapter.interface";
import prisma from "../prismadb";

export class PrismaAdapter implements IDatabaseAdapter {
  recruitment_user = {
    findUnique: async (args: { where: { email: string } }) => {
      return await prisma.users.findUnique({ where: args.where });
    },
    create: async (args: { data: any }) => {
      return await prisma.users.create({ data: args.data });
    },
    update: async (args: { where: { email: string }; data: any }) => {
      return await prisma.users.update({ where: args.where, data: args.data });
    },
    updateById: async (args: { where: { id: number }; data: any }) => {
      return await prisma.users.update({ where: args.where, data: args.data });
    },
    findById: async (args: { where: { id: number } }) => {
      return await prisma.users.findUnique({ where: args.where });
    },
  };

  applicant_profile = {
    findUnique: async (args: { where: { email: string } }) => {
      return await prisma.applicant_profile.findUnique({ where: args.where });
    },
    create: async (args: { data: any }) => {
      return await prisma.applicant_profile.create({ data: args.data });
    },
    update: async (args: { where: { email: string }; data: any }) => {
      return await prisma.applicant_profile.update({
        where: args.where,
        data: args.data,
      });
    },
  };

  bc_configs = {
    findUnique: async (args: { where: { id: string } }) => {
      return await prisma.bc_configs.findUnique({ where: args.where });
    },
    findFirst: async (args?: { where?: any }) => {
      return await prisma.bc_configs.findFirst(args || {});
    },
  };

  app_setup = {
    findFirst: async () => {
      return await prisma.app_setup.findFirst();
    },
    create: async (args: { data: any }) => {
      return await prisma.app_setup.create({ data: args.data });
    },
    update: async (args: { where: { setup_id: number }; data: any }) => {
      return await prisma.app_setup.update({
        where: args.where,
        data: args.data,
      });
    },
  };

  async checkConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Prisma connection check failed:", error);
      return false;
    }
  }

  async queryRaw(query: string): Promise<any> {
    return await prisma.$queryRawUnsafe(query);
  }
}
