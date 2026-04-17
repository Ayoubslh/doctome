import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoSignUp = (e) => {
    e.preventDefault();
    login();
    navigate("/");
  };

  return (
    <div className="w-full bg-transparent p-0">
      <h2 className="text-3xl font-extrabold text-text-dark text-left mb-2">
        Create an Account
      </h2>
      <p className="text-text-muted text-sm text-left mb-8">
        Join Doctome to start managing your clinic.
      </p>

      <form onSubmit={handleDemoSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark block">
              First Name
            </label>
            <input
              type="text"
              placeholder="Sarah"
              className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark block">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Jenkins"
              className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="admin@doctome.com"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 mt-8 shadow-md hover:shadow-lg transition-shadow text-base font-semibold">
          Sign Up for Free
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted mt-10">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline hover:text-[#0284c7] transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
