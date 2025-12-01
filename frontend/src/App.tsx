// import { MainLayout } from "./components/layout/MainLayout";
// import { ThemeProvider } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import store from "./store";
import Layout from "@/components/layout/Layout";
import "./styles/global.css";
import Theme from "@/theme/Theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthenticationResult, EventType } from "@azure/msal-browser";
import { LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// Define environment configuration type
interface EnvironmentConfig {
  clientId: string;
  authority: string;
}

// Define environment configurations
const environmentConfigs: Record<"ROM" | "HRP", EnvironmentConfig> = {
  ROM: {
    clientId: "421c7fd5-2b20-45df-9b69-fcfca41d6ce2",
    authority:
      "https://login.microsoftonline.com/24528e89-fa53-4fc5-9847-429bb50802ff",
  },
  HRP: {
    clientId: "2d426493-7077-4eff-bace-cadbbed558bd",
    authority:
      "https://login.microsoftonline.com/df78e20f-3ca1-4018-9157-8bedb2673da2",
  },
};

function App() {
  const environmentType = "ROM" as const;
  const config = environmentConfigs[environmentType];

  const pca = new PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: window.location.origin + "/recruitment-app/",
      postLogoutRedirectUri: window.location.origin + "/recruitment-app/",
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
    system: {
      loggerOptions: {
        loggerCallback: (message) => {
          console.log(message);
        },
        logLevel: LogLevel.Error,
      },
      windowHashTimeout: 60000,
      iframeHashTimeout: 6000,
      loadFrameTimeout: 0,
    },
  });

  pca.initialize().catch((error) => {
    console.error("MSAL Initialization Error:", error);
    localStorage.clear();
    sessionStorage.clear();
  });

  pca.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      if (payload.account) {
        pca.setActiveAccount(payload.account);
      }
    }
  });

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <MsalProvider instance={pca}>
          <BrowserRouter basename="/recruitment-app">
            <Theme>
              <Layout />
            </Theme>
          </BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Toaster position="top-right" />
        </MsalProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
