import SignUpForm from "./SignUpForm";
import { AuthPage } from "@/components/layout/AuthLayout";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

const SignUp = () => {
  const companyName = useCompanyName();

  return (
    <AuthPage
      title="Create Account"
      subtitle={`Join ${companyName} Recruitment Portal`}
      rightTitle={`Welcome to ${companyName} Recruitment Portal`}
      rightSubtitle="Start Your Healthcare Journey With Us"
    >
      <SignUpForm disableSubmit={false} />
    </AuthPage>
  );
};

export default SignUp;
