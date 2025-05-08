export type AppConfig = {
  apiPrefix: string;
  apiBcPreix:string
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  tourPath: string;
  locale: string;
  enableMock: boolean;
};

const appConfig: AppConfig = {
  apiPrefix: "http://localhost:8001/api",
  // apiBcPreix: "https://api.businesscentral.dynamics.com/v2.0/24528e89-fa53-4fc5-9847-429bb50802ff/ROMProduction/",
  apiBcPreix:   "https://api.businesscentral.dynamics.com/v2.0/df78e20f-3ca1-4018-9157-8bedb2673da2/HRPSandbox4Developments/",
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/app/account/kyc-form",
  locale: "en",
  enableMock: true,
};

export default appConfig;
