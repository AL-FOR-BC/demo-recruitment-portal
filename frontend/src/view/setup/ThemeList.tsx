import { useState } from "react";
import { Link } from "react-router-dom";

interface Theme {
  id: number;
  name: string;
  primaryColor: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
}

const ThemeList = () => {
  const [themes] = useState<Theme[]>([
    {
      id: 1,
      name: "Default Theme",
      primaryColor: "#0D55A3",
      logo: "/logo-rom.png",
      isActive: true,
      createdAt: "2024-03-15",
    },
    // Add more themes here
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Theme Management</h1>
          <Link
            to="/setup/new"
            className="px-4 py-2 bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90"
          >
            Create New Theme
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
            >
              {/* Preview Section */}
              <div
                className="h-40 flex items-center justify-center"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <img
                  src={theme.logo}
                  alt={theme.name}
                  className="h-20 object-contain"
                />
              </div>

              {/* Info Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                  {theme.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span className="text-sm text-gray-600">
                      {theme.primaryColor}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(theme.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  {!theme.isActive && (
                    <button className="flex-1 px-3 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90">
                      Activate
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeList; 