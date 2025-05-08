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
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
    </Provider>
  );
}

export default App;
