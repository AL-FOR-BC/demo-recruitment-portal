import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiForgotPassword } from "@/services/AuthService";
import { useTheme } from "@/utils/hooks/useTheme";
import { Spinner } from "@/components/common/Spinner";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiForgotPassword({ email });
      console.log(response);
      setIsEmailSent(true);
      toast.success("OTP has been sent to your email");
      navigate("/otp", { state: { email, isPasswordReset: true } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Check your email
          </h3>
          <p className="text-gray-600">
            We have sent password reset instructions to
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        <Link
          to="/sign-in"
          className="block w-full py-3 px-4 text-center border rounded-lg hover:opacity-90 transition-all"
          style={{
            color: themeColor,
            borderColor: themeColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${themeColor}0D`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you an OTP to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                {isSubmitting ? (
                  <>
                    <Spinner variant="button" size="sm" />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/sign-in"
                className="text-sm font-medium hover:opacity-80 transition-colors"
                style={{ color: themeColor }}
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
