import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, BriefcaseBusiness, Settings, LogOut, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Will be connected to auth state later
  const [userType, setUserType] = useState<"jobseeker" | "recruiter" | null>("recruiter"); // Will be populated from auth

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mock logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    // Will implement actual logout logic later
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseBusiness className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HireHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-700 hover:text-primary">
              Browse Jobs
            </Link>
            
            {userType === "recruiter" && (
              <Link to="/post-job" className="text-gray-700 hover:text-primary">
                Post a Job
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">John Doe</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@example.com</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                    {userType === "jobseeker" ? (
                      <Link to="/applications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FileText className="h-4 w-4 mr-2" />
                        My Applications
                      </Link>
                    ) : (
                      <Link to="/posted-jobs" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Building2 className="h-4 w-4 mr-2" />
                        Posted Jobs
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth?type=login" className="text-gray-700 hover:text-primary">
                  Sign In
                </Link>
                <Link
                  to="/auth?type=register"
                  className="btn-primary inline-block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Jobs
            </Link>

            {userType === "recruiter" && (
              <Link
                to="/post-job"
                className="block text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Post a Job
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account Settings
                </Link>
                {userType === "jobseeker" ? (
                  <Link
                    to="/applications"
                    className="block text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                ) : (
                  <Link
                    to="/posted-jobs"
                    className="block text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Posted Jobs
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?type=login"
                  className="block text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?type=register"
                  className="btn-primary block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
