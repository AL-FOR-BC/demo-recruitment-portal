import { SignUpCredential } from "@/@types/auth";
import useAuth from "@/utils/hooks/useAuth";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "@/utils/hooks/useTheme";

interface SignUpFormProps {
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

const SignUpForm = ({ disableSubmit = false }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";

  // Check passwords match on every change
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    const data: SignUpCredential = {
      email,
      fullName,
      password,
    };

    try {
      const result = (await signUp(data)) as ApiResponse;

      if (result.status === "failed" && result.message) {
        toast.error(result.message);
      } else if (result.errors?.length) {
        // Handle validation errors
        const newFieldErrors: Record<string, string> = {};
        result.errors.forEach((err) => {
          newFieldErrors[err.field] = err.message;
        });
        setFieldErrors(newFieldErrors);

        // Show first error in toast
        toast.error(result.errors[0].message);
      } else if (result.status === "success") {
        toast.success(
          "Account created successfully! Please proceed to check your email for OTP!"
        );
        navigate("/otp", { state: { email: email, isPasswordReset: false } });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      console.error("Sign up failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setfullName(e.target.value)}
          placeholder="John Doe"
          className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all ${
            fieldErrors.fullName ? "border-red-500" : "border-gray-200"
          }`}
          style={
            {
              "--tw-ring-color": `${themeColor}50`,
            } as React.CSSProperties
          }
          onFocus={(e) => {
            if (!fieldErrors.fullName) {
              e.currentTarget.style.borderColor = themeColor;
            }
          }}
          onBlur={(e) => {
            if (!fieldErrors.fullName) {
              e.currentTarget.style.borderColor = "";
            }
          }}
          required
        />
        {fieldErrors.fullName && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all ${
            fieldErrors.email ? "border-red-500" : "border-gray-200"
          }`}
          style={
            {
              "--tw-ring-color": `${themeColor}50`,
            } as React.CSSProperties
          }
          onFocus={(e) => {
            if (!fieldErrors.email) {
              e.currentTarget.style.borderColor = themeColor;
            }
          }}
          onBlur={(e) => {
            if (!fieldErrors.email) {
              e.currentTarget.style.borderColor = "";
            }
          }}
          required
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all"
            style={
              {
                "--tw-ring-color": `${themeColor}50`,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = themeColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••"
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all ${
              passwordError ? "border-red-500" : "border-gray-200"
            }`}
            style={
              {
                "--tw-ring-color": `${themeColor}50`,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              if (!passwordError) {
                e.currentTarget.style.borderColor = themeColor;
              }
            }}
            onBlur={(e) => {
              if (!passwordError) {
                e.currentTarget.style.borderColor = "";
              }
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 border-gray-300 rounded focus:ring-2"
          style={
            {
              accentColor: themeColor,
              "--tw-ring-color": themeColor,
            } as React.CSSProperties
          }
          required
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I agree to the{" "}
          <a
            href="/terms"
            className="hover:opacity-80 transition-colors"
            style={{ color: themeColor }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="hover:opacity-80 transition-colors"
            style={{ color: themeColor }}
          >
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={disableSubmit}
        className="w-full py-3.5 px-4 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        Create Account
      </button>

      <p className="text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <a
          onClick={() => navigate("/sign-in")}
          className="font-medium hover:opacity-80 transition-colors cursor-pointer"
          style={{ color: themeColor }}
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
