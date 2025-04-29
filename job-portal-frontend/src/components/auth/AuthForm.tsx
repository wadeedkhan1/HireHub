import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import authService from "@/services/authService";

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"applicant" | "recruiter">("applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = async (role: "applicant" | "recruiter") => {
    setDemoLoading(role);
    try {
      let response;
      if (role === "applicant") {
        response = await authService.demoApplicantLogin();
        console.log("Demo applicant login response:", response);
        toast.success("Logged in as demo applicant");
      } else {
        response = await authService.demoRecruiterLogin();
        console.log("Demo recruiter login response:", response);
        toast.success("Logged in as demo recruiter");
      }
      
      // Redirect to dashboard or appropriate page based on role
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Demo login error:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      
      toast.error(
        error.response?.data?.message || 
        "Login failed. Please check if the backend server is running correctly."
      );
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validation
      if (type === "login" && (!email || !password)) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (type === "register" && (!email || !password || !name)) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (type === "register" && password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (type === "login") {
        // Login user
        const response = await authService.login({ email, password });
        console.log("Login response:", response);
        toast.success("Successfully logged in!");
        
        // Redirect based on user type
        navigate("/dashboard");
      } else {
        // Register user
        const registerData = {
          name,
          email,
          password,
          user_type: userType
        };
        
        console.log("Registering with data:", registerData);
        const response = await authService.register(registerData);
        console.log("Register response:", response);
        
        toast.success("Account created successfully! Please log in.");
        navigate("/auth?type=login");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      
      toast.error(
        error.response?.data?.message || 
        "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === "login" ? "Sign In to HireHub" : "Create an Account"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {type === "register" && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border rounded-md p-3 cursor-pointer text-center ${
                    userType === "applicant"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUserType("applicant")}
                >
                  <span className="text-sm font-medium">Job Seeker</span>
                </div>
                <div
                  className={`border rounded-md p-3 cursor-pointer text-center ${
                    userType === "recruiter"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUserType("recruiter")}
                >
                  <span className="text-sm font-medium">Recruiter</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : type === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
      
      {type === "login" && (
        <div className="mt-6">
          <p className="text-sm text-center text-gray-600 mb-3">Try our quick demo accounts</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!!demoLoading}
              onClick={() => handleDemoLogin("applicant")}
            >
              {demoLoading === "applicant" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Demo Applicant"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!!demoLoading}
              onClick={() => handleDemoLogin("recruiter")}
            >
              {demoLoading === "recruiter" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Demo Recruiter"
              )}
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        {type === "login" ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth?type=register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign up
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth?type=login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
