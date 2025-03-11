// import { MainLayout } from "./components/layout/MainLayout";
// import { ThemeProvider } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import store from "./store";
import Layout from "@/components/layout/Layout";
import "./styles/global.css";
import Theme from "@/theme/Theme";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Theme>
          <Layout />
        </Theme>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
