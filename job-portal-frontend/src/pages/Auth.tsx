
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const authType = searchParams.get("type") || "login";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto">
            <AuthForm type={authType as "login" | "register"} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
