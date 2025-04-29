import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, BriefcaseBusiness, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import authService from "@/services/authService";
import profileService from "@/services/profileService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to not logged in
  const [userType, setUserType] = useState<"jobseeker" | "recruiter" | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check auth state and load user profile on component mount
  useEffect(() => {
    const checkAuthState = async () => {
      const isAuth = authService.isAuthenticated();
      setIsLoggedIn(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        if (user) {
          setUserType(user.type);
          
          try {
            // Fetch full profile data to get name and email
            const profileData = await profileService.getProfile();
            setUserName(profileData.name || "User");
            setUserEmail(profileData.email || "");
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to basic info
            setUserName("User");
            setUserEmail(user.email || "");
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuthState();
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserType(null);
    setIsDropdownOpen(false);
    navigate("/");
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
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2"
                    onClick={toggleDropdown}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{isLoading ? "User" : userName}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{isLoading ? "User" : userName}</p>
                        <p className="text-xs text-gray-500">{isLoading ? "" : userEmail}</p>
                        <p className="text-xs mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block">
                          {userType === "recruiter" ? "Recruiter" : "Job Seeker"}
                        </p>
                      </div>
                      
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-2 text-blue-500" />
                        Account Settings
                      </Link>
                      
                      <div className="border-t my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
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
                <div className="px-4 py-2 mb-2 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">{isLoading ? "User" : userName}</p>
                  <p className="text-xs text-gray-500">{isLoading ? "" : userEmail}</p>
                  <p className="text-xs mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block">
                    {userType === "recruiter" ? "Recruiter" : "Job Seeker"}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-800"
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
