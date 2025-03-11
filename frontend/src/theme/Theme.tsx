import { CommonProps } from "@/@types/common";
import ConfigProvider from "@/ui/ConfigProvider/ConfigProvider";

function Theme(props: CommonProps) {
  const currentTheme = {
    primaryColor: "#0D55A3",
    logo: "",
    updateTheme: () => {},
  };
  return <ConfigProvider value={currentTheme}>{props.children}</ConfigProvider>;
}
export default Theme;
