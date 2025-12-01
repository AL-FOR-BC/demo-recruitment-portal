import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiResetPassword } from "@/services/AuthService";
import { useTheme } from "@/utils/hooks/useTheme";
import { Spinner } from "@/components/common/Spinner";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiResetPassword({ 
        email,
        newPassword 
      });
      
      toast.success("Password has been reset successfully");
      navigate("/sign-in");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid reset request. Please try again.</p>
        <Link 
          to="/forgot-password" 
          className="mt-4 hover:opacity-80 transition-colors"
          style={{ color: themeColor }}
        >
          Back to Forgot Password
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
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all"
                  style={{
                    '--tw-ring-color': `${themeColor}50`,
                  } as React.CSSProperties}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = themeColor;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
                  }}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all"
                  style={{
                    '--tw-ring-color': `${themeColor}50`,
                  } as React.CSSProperties}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = themeColor;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
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
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  "Reset Password"
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

export default ResetPasswordForm; 