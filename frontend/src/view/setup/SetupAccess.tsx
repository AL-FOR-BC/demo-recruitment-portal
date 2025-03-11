import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetupAccess = () => {
  const [accessCode, setAccessCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...accessCode];
    newCode[index] = value;
    setAccessCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`access-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !accessCode[index] && index > 0) {
      const prevInput = document.getElementById(`access-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.join("");
    
    // Replace this with your actual verification logic
    const correctCode = "123456"; // Store this securely, maybe in env variables
    
    if (code === correctCode) {
      // Store access token in session storage
      sessionStorage.setItem("setupAccess", "granted");
      navigate("/setup");
    } else {
      setError("Invalid access code");
      setAccessCode(["", "", "", "", "", ""]);
      document.getElementById("access-0")?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Setup Access
            </h1>
            <p className="text-gray-600">
              Enter the setup access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between gap-2">
                {accessCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`access-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-black"
                    required
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 font-medium transition-colors"
            >
              Verify Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupAccess; 