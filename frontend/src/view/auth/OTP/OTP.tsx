import OTPForm from "./OTPForm";
import { AuthPage } from "@/components/layout/AuthLayout";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const navigate = useNavigate();

  const handleVerificationSuccess = () => {
    // Handle successful verification, e.g., redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <AuthPage
      title="OTP Verification"
      subtitle="Enter the verification code"
      rightTitle="Secure Authentication"
      rightSubtitle="Protecting Your Account with Two-Factor Authentication"
    >
      <OTPForm disableSubmit={false} onSuccess={handleVerificationSuccess} />
    </AuthPage>
  );
};

export default OTP;
