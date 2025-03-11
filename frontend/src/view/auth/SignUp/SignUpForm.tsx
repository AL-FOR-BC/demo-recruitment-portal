import { useState } from "react";

interface SignUpFormProps {
  disableSubmit?: boolean;
}

const SignUpForm = ({ disableSubmit = false }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
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

      <div className="space-y-2">
        <label className="block text-gray-600 text-sm font-medium">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] text-gray-600"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 text-[#0D55A3] border-gray-300 rounded focus:ring-[#0D55A3]"
          required
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I agree to the{" "}
          <a href="/terms" className="text-[#0D55A3] hover:text-[#0D55A3]/80">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#0D55A3] hover:text-[#0D55A3]/80">
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={disableSubmit}
        className="w-full py-3.5 px-4 bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Account
      </button>

      <p className="text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <a
          href="/signin"
          className="text-[#0D55A3] font-medium hover:text-[#0D55A3]/80"
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
