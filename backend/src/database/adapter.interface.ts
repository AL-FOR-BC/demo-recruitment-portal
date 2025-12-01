// Database adapter interface - defines common operations
// Both Prisma and Mongoose adapters will implement this interface

export interface IDatabaseAdapter {
  // User operations
  recruitment_user: {
    findUnique: (args: { where: { email: string } }) => Promise<any>;
    create: (args: { data: any }) => Promise<any>;
    update: (args: { where: { email: string }; data: any }) => Promise<any>;
    updateById: (args: { where: { id: number }; data: any }) => Promise<any>;
    findById: (args: { where: { id: number } }) => Promise<any>;
  };

  // Applicant Profile operations
  applicant_profile: {
    findUnique: (args: { where: { email: string } }) => Promise<any>;
    create: (args: { data: any }) => Promise<any>;
    update: (args: { where: { email: string }; data: any }) => Promise<any>;
  };

  // BC Config operations
  bc_configs: {
    findUnique: (args: { where: { id: string } }) => Promise<any>;
    findFirst: (args?: { where?: any }) => Promise<any>;
  };

  // App Setup operations
  app_setup: {
    findFirst: () => Promise<any>;
    create: (args: { data: any }) => Promise<any>;
    update: (args: { where: { setup_id: number }; data: any }) => Promise<any>;
  };

  // Health check
  checkConnection: () => Promise<boolean>;

  // Query raw (for testing connection)
  queryRaw: (query: string) => Promise<any>;
}
