import { ReactNode } from "react";
import Views from "@/view/View";
import logo from "@/assets/logo-rom.png";
import { useConfig } from "@/ui/ConfigProvider/ConfigProvider";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

// Props for the auth page layout
interface AuthPageProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  rightTitle: string;
  rightSubtitle: string;
}

// Main auth page layout component
export const AuthPage = ({
  children,
  title,
  subtitle,
  rightTitle,
  rightSubtitle,
}: AuthPageProps) => {
  const companyName = useCompanyName();
  let primaryColor = "#094BAC";
  let displayLogo = logo;
  
  try {
    const config = useConfig();
    primaryColor = config.primaryColor || "#094BAC";
    displayLogo = config.logo || logo;
  } catch (error) {
    console.error("Error accessing config:", error);
    // Use defaults
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      {/* Main Card */}
      <div className="flex flex-col-reverse md:flex-row w-full max-w-[1100px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative z-20">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#111827]">
                {title}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        {/* Right Section - Blue Background with Content */}
        <div
          className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden min-h-[250px] md:min-h-0"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Main Content */}
          <div className="text-white space-y-4 sm:space-y-6 relative z-10 mb-6 sm:mb-20">
            <img src={displayLogo} alt={companyName} className="mb-4 sm:mb-8 h-20 sm:h-40" />
            <h2 className="text-xl sm:text-3xl font-bold leading-tight">
              {rightTitle}
            </h2>
            <p className="text-lg sm:text-2xl text-white/90 max-w-md leading-relaxed">
              {rightSubtitle}
            </p>
          </div>

          {/* Decorative Elements - Hide on small screens */}
          <div className="hidden md:block absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <div className="w-64 h-64 rounded-full border-[40px] border-sky-500/20" />
          </div>
          <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2">
            <div className="w-32 h-32 rounded-full border-[20px] border-blue-300/20" />
          </div>
          <div className="hidden md:block absolute bottom-20 left-20">
            <div className="w-4 h-4 rounded-full bg-sky-300" />
            <div className="w-24 border-b-2 border-dashed border-sky-300 transform rotate-45 origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main auth layout wrapper
function AuthLayout() {
  return <Views />;
}

export default AuthLayout;
