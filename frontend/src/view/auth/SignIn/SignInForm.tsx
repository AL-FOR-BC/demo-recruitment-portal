import useAuth from "@/utils/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "@/utils/hooks/useTheme";
import { Spinner } from "@/components/common/Spinner";

import { FaMicrosoft } from "react-icons/fa";
import { useMsal } from "@azure/msal-react";
import { BrowserAuthError } from "@azure/msal-browser";

interface SignInFormProps {
  disableSubmit?: boolean;
}
interface ValidationError {
  field: string;
  message: string;
}
interface ApiResponse {
  status: string;
  errors?: ValidationError[];
  message?: string;
}

// Add an interface for the error response
interface ErrorResponse {
  message: string;
  statusCode?: number;
}

const SignInForm = ({ disableSubmit = false }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { instance } = useMsal();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";

  console.log(fieldErrors);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear previous errors
    setFieldErrors({});

    const data = {
      email: email,
      password: password,
    };

    try {
      const result = (await signIn(data)) as ApiResponse;

      // Handle specific known errors
      if (result.message === "User not found") {
        toast.warning("You don't have an account. Please proceed to sign up.");
        return;
      }
      if (result.message === "Invalid Password") {
        toast.error("Invalid password. Please try again.");
        return;
      }

      // Handle successful login
      if (result.status === "success") {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }

      if (result.message == "User not verified") {
        toast.warning("OTP code has been sent to your email");
        navigate("/otp", { state: { email: email, isPasswordReset: false } });
      }
      console.log(result);
    } catch (error) {
      // Enhanced error handling
      const err = error as ErrorResponse;

      if (err.statusCode === 500) {
        toast.error("Server error. Please try again later or contact support.");
      } else if (err.message === "Network Error") {
        toast.error(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else if (err.message === "Internal server error") {
        toast.error("Something went wrong. Please try again later.");
      } else {
        // Generic error message for unhandled cases
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      // Clear any existing auth state first
      await instance.clearCache();
      localStorage.clear();
      sessionStorage.clear();

      // Configure login request
      const loginRequest = {
        scopes: ["openid", "profile", "email"],
        prompt: "select_account",
      };

      // Attempt login
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
      // Show more specific error message
      if (error instanceof BrowserAuthError) {
        toast.error(`Authentication Error: ${error.errorMessage}`);
      } else {
        toast.error("Failed to initialize login. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="demo@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all"
          style={{
            '--tw-ring-color': `${themeColor}50`,
          } as React.CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = themeColor;
            e.currentTarget.style.setProperty('--tw-ring-color', `${themeColor}50`);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '';
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all"
          style={{
            '--tw-ring-color': `${themeColor}50`,
          } as React.CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = themeColor;
            e.currentTarget.style.setProperty('--tw-ring-color', `${themeColor}50`);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '';
          }}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e: any) => setRememberMe(e)}
            className="w-4 h-4 text-[#0D55A3] border-gray-300 rounded focus:ring-[#0D55A3]"
          /> */}
          <label htmlFor="remember">{/* Remember my preference */}</label>
        </div>
        <a
          onClick={() => navigate("/forgot-password")}
          className="text-sm hover:opacity-80 transition-colors cursor-pointer"
          style={{ color: themeColor }}
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={disableSubmit || isLoading}
        className="w-full py-3.5 px-4 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        style={{ 
          backgroundColor: themeColor,
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = `${themeColor}E6`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = themeColor;
        }}
      >
        {isLoading ? (
          <>
            <Spinner variant="button" size="sm" className="mr-2" />
            <span>Signing In...</span>
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500 bg-white">Or</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleMicrosoftSignIn}
          className="w-full max-w-md py-3.5 px-6 bg-[#2F2F2F] hover:bg-[#2F2F2F]/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <FaMicrosoft className="w-5 h-5" />
          <span>Sign in with Microsoft Azure</span>
        </button>
      </div>

      <div className="mt-8">
        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium hover:opacity-80 transition-colors"
            style={{ color: themeColor }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
