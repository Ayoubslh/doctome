import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLogin = (e) => {
    e.preventDefault();
    login();
    navigate("/");
  };

  return (
    <div className="w-full bg-transparent p-0">
      <h2 className="text-3xl font-extrabold text-text-dark text-left mb-2">
        Welcome Back
      </h2>
      <p className="text-text-muted text-sm text-left mb-8">
        Please enter your details to sign in.
      </p>

      <form onSubmit={handleDemoLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-dark block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="admin@doctome.com"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark block">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary font-medium hover:underline hover:text-[#0284c7] transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 mt-6 shadow-md hover:shadow-lg transition-shadow text-base font-semibold">
          Sign In
        </Button>
      </form>

      <div className="mt-8 flex items-center justify-between pointer-events-none opacity-60">
        <span className="w-[30%] border-b border-border-light"></span>
        <span className="text-xs text-text-muted font-bold uppercase tracking-wider text-center mx-2">
          Or continue with
        </span>
        <span className="w-[30%] border-b border-border-light"></span>
      </div>

      <Button
        variant="outline"
        className="w-full py-3 mt-8 border-border-light hover:bg-border-subtle"
        onClick={handleDemoLogin}>
        Demo Auto-Login
      </Button>

      <p className="text-center text-sm text-text-muted mt-10">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary font-semibold hover:underline hover:text-[#0284c7] transition-colors">
          Sign up for free
        </Link>
      </p>
    </div>
  );
};

export default Login;
