import useAuth from "@/utils/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

const SignInForm = ({ disableSubmit = false }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

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

      if (result.status == "success") {
        toast.success("Signed in successfully!");
      }
      if (result.message == "User not verified") {
        toast.warning("OTP code has been sent to your email");
        navigate("/otp");
      }
      if (result.message == "User not found") {
        toast.warning("You don't have an account. Please proceed to sign up.");
      }
      if (result.message == "Invalid Password") {
        toast.error("Invalid password. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response;

        if (response?.data?.errors?.length) {
          // Handle validation errors
          const newFieldErrors: Record<string, string> = {};
          response.data.errors.forEach((err: ValidationError) => {
            newFieldErrors[err.field] = err.message;
          });
          setFieldErrors(newFieldErrors);

          // Show first error in toast
          toast.error(response.data.errors[0].message);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e: any) => setRememberMe(e)}
            className="w-4 h-4 text-[#0D55A3] border-gray-300 rounded focus:ring-[#0D55A3]"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
            Remember my preference
          </label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm text-[#0D55A3] hover:text-[#0D55A3]/80"
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={disableSubmit || isLoading}
        className="w-full py-3.5 px-4 bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            <span className="ml-2">Signing In...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      <p className="text-center text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="text-[#0D55A3] font-medium hover:text-[#0D55A3]/80"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
