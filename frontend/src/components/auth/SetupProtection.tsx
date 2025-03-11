import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SetupProtectionProps {
  children: React.ReactNode;
}

const SetupProtection = ({ children }: SetupProtectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("setupAccess") === "granted";
    if (!hasAccess) {
      navigate("/setup-access", {
        state: { returnPath: location.pathname }
      });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default SetupProtection; 