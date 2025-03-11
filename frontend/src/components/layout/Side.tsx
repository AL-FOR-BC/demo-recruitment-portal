import { ReactNode } from "react";
import logo from "@/assets/logo-rom.png";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  rightTitle: string;
  rightSubtitle: string;
}

const Side = ({
  children,
  title,
  subtitle,
  rightTitle,
  rightSubtitle,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {/* Main Card */}
      <div className="flex w-full max-w-[1100px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative z-20">
        {/* Left Section - Form */}
        <div className="w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-[32px] font-bold text-[#111827]">{title}</h1>
              <p className="text-gray-500 text-lg">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        {/* Right Section - Blue Background with Content */}
        <div className="w-1/2 bg-[#0D55A3] p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Main Content */}
          <div className="text-white space-y-6 relative z-10 mb-20">
            <img src={logo} alt="ROM" className="mb-8 h-40" />
            <h2 className="text-3xl font-bold leading-tight">{rightTitle}</h2>
            <p className="text-2xl text-white/90 max-w-md leading-relaxed">
              {rightSubtitle}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <div className="w-64 h-64 rounded-full border-[40px] border-sky-500/20" />
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
            <div className="w-32 h-32 rounded-full border-[20px] border-blue-300/20" />
          </div>
          <div className="absolute bottom-20 left-20">
            <div className="w-4 h-4 rounded-full bg-sky-300" />
            <div className="w-24 border-b-2 border-dashed border-sky-300 transform rotate-45 origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Side;
