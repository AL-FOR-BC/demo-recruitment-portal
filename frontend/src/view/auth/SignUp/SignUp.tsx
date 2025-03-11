import SignUpForm from "./SignUpForm";
import { AuthPage } from "@/components/layout/AuthLayout";

const SignUp = () => {
  return (
    <AuthPage
      title="Create Account"
      subtitle="Join ROM Recruitment Portal"
      rightTitle="Welcome to ROM Recruitment Portal"
      rightSubtitle="Start Your Healthcare Journey With Us"
    >
      <SignUpForm disableSubmit={false} />
    </AuthPage>
  );
};

export default SignUp;
