import SignInForm from "./SignInForm";
import { AuthPage } from "@/components/layout/AuthLayout";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

const SignIn = () => {
  const companyName = useCompanyName();

  return (
    <AuthPage
      title="Welcome Back"
      subtitle="Sign in to continue"
      rightTitle={`Welcome to ${companyName} Recruitment Portal`}
      rightSubtitle="Empowering Healthcare Different Part of Uganda"
    >
      <SignInForm disableSubmit={false} />
    </AuthPage>
  );
};

export default SignIn;
