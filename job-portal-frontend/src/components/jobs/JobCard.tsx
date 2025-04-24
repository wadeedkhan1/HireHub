import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPin, Clock, DollarSign, Briefcase, Tag, Timer, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface JobData {
  id: number;
  title: string;
  recruiter_id?: number;
  category?: string;
  location?: string;
  salary?: string | number;
  job_type: string;
  duration?: number;
  max_positions?: number;
  max_applicants?: number;
  date_of_posting?: string;
  deadline?: string | null;
  skills?: string[];
  description?: string;
  active_applications?: number;
  accepted_candidates?: number;
}

interface JobCardProps {
  job: JobData;
  compact?: boolean;
}

const JobCard = ({ job, compact = false }: JobCardProps) => {
  const { 
    id, 
    title, 
    category, 
    location, 
    salary, 
    job_type, 
    duration, 
    max_positions,
    max_applicants,
    date_of_posting,
    deadline,
    skills 
  } = job;
  
  // Format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format salary
  const formatSalary = (salaryValue: string | number | undefined) => {
    if (!salaryValue) return "Not specified";
    
    const numericValue = typeof salaryValue === 'string' 
      ? parseInt(salaryValue.replace(/[^0-9]/g, '')) 
      : salaryValue;
      
    return `PKR ${numericValue.toLocaleString()}`;
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadlineString?: string) => {
    if (!deadlineString) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadlineString);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  
  // Badge colors for job type
  const getJobTypeBadgeColor = (type: string) => {
    const typeLC = type.toLowerCase();
    switch(typeLC) {
      case 'full-time': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'part-time': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'contract': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'internship': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  // Get deadline status color
  const getDeadlineStatusColor = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days <= 0) return "text-red-600";
    if (days <= 3) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group hover:border-blue-300 hover:translate-y-[-5px]">
      <div className={`${compact ? 'p-5' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link to={`/jobs/${id}`}>
              <h3 className={`font-bold text-gray-900 hover:text-blue-600 transition-colors ${compact ? 'text-base' : 'text-xl'} group-hover:text-blue-600`}>
                {title}
              </h3>
            </Link>
            
            {date_of_posting && (
              <div className="flex items-center mt-1.5 text-gray-500 text-xs">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Posted {formatDate(date_of_posting)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getJobTypeBadgeColor(job_type)} border-0 font-medium px-3 py-1`}>
              {job_type}
            </Badge>
            
            {category && (
              <Badge variant="outline" className="text-xs bg-blue-50 font-normal">
                {category}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Middle section with key job details */}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {location && (
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          
          {salary !== undefined && (
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium">{formatSalary(salary)}</span>
            </div>
          )}
          
          {duration && (
            <div className="flex items-center text-gray-700">
              <Timer className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
              <span className="text-sm">{duration} month{duration !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Bottom section with additional information */}
        {!compact && (
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
            {max_positions && (
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">{max_positions} position{max_positions !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {max_applicants && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">Max {max_applicants} applicants</span>
              </div>
            )}
            
            {deadline && (
              <div className="flex items-center">
                <AlertCircle className={`h-4 w-4 mr-1.5 flex-shrink-0 ${getDeadlineStatusColor(daysUntilDeadline)}`} />
                <span className={`text-sm ${getDeadlineStatusColor(daysUntilDeadline)}`}>
                  {daysUntilDeadline !== null ? (
                    daysUntilDeadline > 0 ? 
                      `Closes in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}` : 
                      "Closed"
                  ) : (
                    `Deadline: ${formatDate(deadline)}`
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-lg group-hover:bg-blue-50 transition-colors">
          <Link 
            to={`/jobs/${id}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobCard;
