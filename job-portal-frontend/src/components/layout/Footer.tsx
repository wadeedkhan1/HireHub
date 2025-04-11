
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Github, Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseBusiness className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">HireHub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting talents with opportunities, making job search simple and effective.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">For Job Seekers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-gray-600 hover:text-primary">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=IT" className="text-sm text-gray-600 hover:text-primary">
                  IT Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Finance" className="text-sm text-gray-600 hover:text-primary">
                  Finance Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Science" className="text-sm text-gray-600 hover:text-primary">
                  Science Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">For Employers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/post-job" className="text-sm text-gray-600 hover:text-primary">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-gray-600 hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} HireHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
