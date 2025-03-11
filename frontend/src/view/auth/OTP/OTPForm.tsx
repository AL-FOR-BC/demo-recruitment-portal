import { useState } from "react";
import { Link } from "react-router-dom";

interface OTPFormProps {
  disableSubmit?: boolean;
  email?: string;
}

const OTPForm = ({
  disableSubmit = false,
  email = "user@example.com",
}: OTPFormProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification logic here
    console.log("OTP:", otp.join(""));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          We have sent a verification code to <br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

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
              className="w-12 h-12 text-center text-black text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={disableSubmit || otp.some((digit) => !digit)}
          className="w-full py-3.5 px-4 bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Code
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-gray-500 text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="text-[#0D55A3] font-medium hover:text-[#0D55A3]/80"
          >
            Resend
          </button>
        </p>
        <Link
          to="/sign-in"
          className="text-[#0D55A3] text-sm font-medium hover:text-[#0D55A3]/80 inline-block"
        >
          Back to Sign In
        </Link>
      </div>
    </form>
  );
};

export default OTPForm;
