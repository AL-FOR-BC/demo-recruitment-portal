import OTPForm from "./OTPForm";
import { AuthPage } from "@/components/layout/AuthLayout";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If state is null, provide default values
  const { isPasswordReset = false, email = "" } = location.state || {};

  // Redirect if no email is provided
  if (!email) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleVerificationSuccess = () => {
    if (isPasswordReset) {
      navigate("/reset-password", { state: { email } });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <AuthPage
      title="OTP Verification"
      subtitle="Enter the verification code"
      rightTitle="Secure Authentication"
      rightSubtitle="Protecting Your Account with Two-Factor Authentication"
    >
      <OTPForm
        disableSubmit={false}
        email={email}
        onSuccess={handleVerificationSuccess}
      />
    </AuthPage>
  );
};

export default OTP;
