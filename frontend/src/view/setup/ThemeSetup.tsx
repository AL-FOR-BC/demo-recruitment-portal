import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router-dom";

// interface ThemeSetupProps {
//   onSave?: (config: { primaryColor: string; logo: File | null }) => void;
// }

const ThemeSetup = () => {
  const navigate = useNavigate();
  const [primaryColor, setPrimaryColor] = useState("#0D55A3");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [name, setName] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("primaryColor", primaryColor);
      if (logo) {
        formData.append("logo", logo);
      }

      // Save to your backend
      await fetch("/api/themes", {
        method: "POST",
        body: formData,
      });

      // Redirect to theme list
      navigate("/setup");
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Theme</h1>
          <button
            onClick={() => navigate("/setup")}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Themes
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Theme Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Theme Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
                required
              />
            </div>

            {/* Color Picker Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="flex gap-4 items-start">
                <HexColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  className="!w-[200px]"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg text-white transition-colors"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Button
                      </button>
                      <div
                        className="h-1 w-full rounded"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Logo Upload
              </label>
              <div className="flex gap-4 items-start">
                <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full p-2"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-500">
                    Recommended size: 200x200px
                    <br />
                    Supported formats: PNG, JPG, SVG
                    <br />
                    Maximum size: 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                style={{ backgroundColor: primaryColor }}
                className="px-6 py-2.5 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>
          <div className="border rounded-lg p-4">
            {/* Add your preview components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSetup;
