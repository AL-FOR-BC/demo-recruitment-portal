import OTPForm from "./OTPForm";
import { AuthPage } from "@/components/layout/AuthLayout";

const OTP = () => {
  return (
    <AuthPage
      title="OTP Verification"
      subtitle="Enter the verification code"
      rightTitle="Secure Authentication"
      rightSubtitle="Protecting Your Account with Two-Factor Authentication"
    >
      <OTPForm disableSubmit={false} email="john.doe@example.com" />
    </AuthPage>
  );
};

export default OTP; 