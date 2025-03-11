import SignInForm from "./SignInForm";
import { AuthPage } from "@/components/layout/AuthLayout";

const SignIn = () => {
  return (
    <AuthPage
      title="Welcome Back"
      subtitle="Sign in to continue"
      rightTitle="Welcome to ROM Recruitment Portal"
      rightSubtitle="Empowering Healthcare Through Digital Innovation"
    >
      <SignInForm disableSubmit={false} />
    </AuthPage>
  );
};

export default SignIn;
