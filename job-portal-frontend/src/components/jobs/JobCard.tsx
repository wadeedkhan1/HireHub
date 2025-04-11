import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPin, Clock, DollarSign, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface JobData {
  id: number;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  job_type: string;
  deadline: string;
  duration?: string;
  createdAt?: string;
  skills?: string[];
}

interface JobCardProps {
  job: JobData;
  compact?: boolean;
}

const JobCard = ({ job, compact = false }: JobCardProps) => {
  const { id, title, company, location, salary, job_type, deadline, skills } = job;
  
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days left until deadline
  const calculateDaysLeft = (deadlineDate: string) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysLeft = calculateDaysLeft(deadline);

  return (
    <div className={`bg-white border rounded-lg shadow-sm hover:shadow transition-shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between">
        <div>
          <Link to={`/jobs/${id}`}>
            <h3 className={`font-bold text-gray-900 hover:text-primary ${compact ? 'text-base' : 'text-lg'}`}>
              {title}
            </h3>
          </Link>
          
          {company && (
            <div className="flex items-center mt-2 text-gray-600">
              <Building className="h-4 w-4 mr-1.5" />
              <span className="text-sm">{company}</span>
            </div>
          )}
        </div>
        
        <Badge className={`${job_type === 'Full-Time' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'} border-0`}>
          {job_type}
        </Badge>
      </div>
      
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {location && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{location}</span>
          </div>
        )}
        
        {salary && (
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{salary}</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-1.5" />
          <span className="text-sm">{`${daysLeft} days left`}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          <span className="text-sm">Apply by {formatDate(deadline)}</span>
        </div>
      </div>
      
      {skills && skills.length > 0 && !compact && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {!compact && (
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/jobs/${id}`} 
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobCard;
