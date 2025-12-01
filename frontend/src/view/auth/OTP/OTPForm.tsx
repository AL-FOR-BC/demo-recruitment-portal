import { useAppSelector } from "@/store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  apiOtp,
  apiOtpResetPassword,
} from "@/services/AuthService";
import { toast } from "react-toastify";
import { useTheme } from "@/utils/hooks/useTheme";
import { Spinner } from "@/components/common/Spinner";

interface OTPFormProps {
  disableSubmit?: boolean;
  email?: string;
  onSuccess?: () => void;
}

// Add this interface for the JWT payload
interface JWTPayload {
  email: string;
  // add other JWT payload fields if needed
}

const OTPForm = ({ disableSubmit = false, onSuccess, email }: OTPFormProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string>("");
  const { signature } = useAppSelector((state) => state.auth.session);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const isPasswordReset = location.state?.isPasswordReset;
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";
  console.log(isPasswordReset);
  useEffect(() => {
    if (!signature && !isPasswordReset) {
      navigate("/sign-in");
    } else if (!signature && isPasswordReset) {
    } else {
      try {
        // Decode and set email when signature is available
        if (signature) {
          const decoded = jwtDecode<JWTPayload>(signature);
          setUserEmail(decoded.email);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        navigate("/sign-in");
      }
    }
  }, [signature, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasting of complete code
      const pastedValue = value.slice(0, 6).split("");
      const newOtp = [...otp];

      pastedValue.forEach((digit, i) => {
        if (i < 6 && /^\d$/.test(digit)) {
          newOtp[i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus the last filled input or the next empty input
      const lastIndex = newOtp.findIndex((digit) => !digit) - 1;
      const targetIndex = lastIndex >= 0 ? lastIndex : 5;
      document.getElementById(`otp-${targetIndex}`)?.focus();
      return;
    }

    // Handle single digit input
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // If pasted data is exactly 6 digits, fill all inputs
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      document.getElementById(`otp-5`)?.focus();
      return;
    }

    // Otherwise, just paste at current position if it's a digit
    if (/^\d*$/.test(pastedData)) {
      handleChange(index, pastedData);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const otpString = otp.join("");
      
      if (isPasswordReset) {
        await apiOtpResetPassword({ email, otp: otpString });
        navigate("/reset-password", { state: { email } });
      } else {
        await apiOtp({ otp: otpString });
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          We have sent a verification code to <br />
          <span className="font-medium text-gray-900">{userEmail || email}</span>
        </p>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="space-y-4">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(e, index)}
              className="w-12 h-12 text-center text-black text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                '--tw-ring-color': `${themeColor}50`,
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = themeColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '';
              }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={
            disableSubmit || isSubmitting || otp.some((digit) => !digit)
          }
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
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Code"
          )}
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-gray-500 text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="font-medium hover:opacity-80 transition-colors"
            style={{ color: themeColor }}
          >
            Resend
          </button>
        </p>
        <Link
          to="/sign-in"
          className="text-sm font-medium hover:opacity-80 transition-colors inline-block"
          style={{ color: themeColor }}
        >
          Back to Sign In
        </Link>
      </div>
    </form>
  );
};

export default OTPForm;
