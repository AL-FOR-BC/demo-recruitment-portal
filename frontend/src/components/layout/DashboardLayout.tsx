import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo-rom.png";
import useAuth from "@/utils/hooks/useAuth";
import { useTheme } from "@/utils/hooks/useTheme";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  to: string;
}

interface AvatarProps {
  fullName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar = ({ fullName, size = "md", className = "" }: AvatarProps) => {
  const { primaryColor } = useTheme();

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-medium 
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ backgroundColor: primaryColor || "#094BAC" }}
    >
      {getInitials(fullName)}
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { signOut } = useAuth();
  const { primaryColor, logo: themeLogo } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const displayLogo = themeLogo || logo;
  const themeColor = primaryColor || "#094BAC";
  const companyName = useCompanyName();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/sign-in");
  };

  const tabs: TabItem[] = [
    {
      key: "home",
      label: "Home",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      to: "/dashboard",
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      to: "/profile",
    },
    // {
    //   key: "contact",
    //   label: "Contact",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    //       />
    //     </svg>
    //   ),
    //   to: "/contact",
    // },
    // {
    //   key: "message",
    //   label: "Message",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    //       />
    //     </svg>
    //   ),
    //   to: "/message",
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 lg:h-24">
            <div className="flex items-center">
              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center -ml-2 sm:-ml-4"
              >
                <img
                  src={displayLogo}
                  alt={`${companyName} Logo`}
                  className="h-16 sm:h-20 lg:h-24 w-auto py-2"
                />
              </Link>
            </div>

            {/* Search Bar - Hide on mobile */}
            <div className="hidden md:flex flex-1 items-center justify-center px-2 lg:px-6">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2"
                    style={
                      {
                        "--tw-ring-color": `${themeColor}50`,
                      } as React.CSSProperties
                    }
                    placeholder="Search something here..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserAvatar
                    fullName={user?.fullName || "User Name"}
                    size="sm"
                    className="sm:hidden"
                  />
                  <UserAvatar
                    fullName={user?.fullName || "User Name"}
                    size="md"
                    className="hidden sm:flex"
                  />
                  <div className="text-sm text-left hidden sm:block">
                    <p className="font-medium text-gray-700 line-clamp-1">
                      {user?.fullName || "User Name"}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu - Adjust position for mobile */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        View Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation - Make scrollable on mobile */}
      <div className="bg-white shadow sticky top-16 sm:top-20 lg:top-24 z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 overflow-x-auto">
          <div className="flex space-x-6 sm:space-x-8 py-2 sm:py-0">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.to;
              return (
                <Link
                  key={tab.key}
                  to={tab.to}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  style={
                    isActive
                      ? {
                          borderBottomColor: themeColor,
                          color: themeColor,
                        }
                      : undefined
                  }
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Adjust padding for mobile */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
