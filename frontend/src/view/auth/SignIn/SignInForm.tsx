import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SignInFormProps {
  disableSubmit?: boolean;
}

const SignInForm = ({ disableSubmit = false }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="demo@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e:any) => setRememberMe(e)}
            className="w-4 h-4 text-[#0D55A3] border-gray-300 rounded focus:ring-[#0D55A3]"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
            Remember my preference
          </label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm text-[#0D55A3] hover:text-[#0D55A3]/80"
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={disableSubmit}
        className="w-full py-3.5 px-4 bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign In
      </button>

      <p className="text-center text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="text-[#0D55A3] font-medium hover:text-[#0D55A3]/80"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
